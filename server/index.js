const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();
const stripe = require("stripe")(process.env.PAYMENT_GATEWAY_KEY);

const app = express();
const port = process.env.PORT || 5001;

// middleware
app.use(cors());
app.use(express.json());

var serviceAccount = require("./firebase-admin-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ynehqwn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db("taskDB");
const tasksCollection = db.collection("tasks");
const usersCollection = db.collection("users");
const paymentsCollection = db.collection("payments");
const submissionsCollection = db.collection("submissions");
const withdrawalsCollection = db.collection("withdrawals");

async function run() {
  try {
    // ================ CUSTOM MIDDLEWARES ===============
    const verifyFBToken = async (req, res, next) => {
      // console.log("Header in middleware", req.headers);

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized access" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).send({ message: "Unauthorized access" });
      }

      // verify the token
      try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.decoded = decoded;

        console.log("Decoded token: ", req.decoded);
        next();
      } catch (error) {
        return res.status(403).send({ message: "Forbidden Access" });
      }
    };

    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const user = await usersCollection.findOne({ email });
      if (!user || user.role !== "Admin") {
        return res.status(403).send({ message: "Forbidden Access" });
      }

      next();
    };

    // ================== USER COLLECTION ==================
    app.post("/users", async (req, res) => {
      try {
        const email = req.body.email;
        const userExists = await usersCollection.findOne({ email });
        if (userExists) {
          return res
            .status(200)
            .send({ message: "User already axists", inserted: false });
        }

        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Server error" });
      }
    });

    // Get all users
    app.get("/users", async (req, res) => {
      try {
        const users = await usersCollection.find().toArray();
        res.status(200).send(users);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });

    // Get single user by email
    app.get("/users/:email", async (req, res) => {
      try {
        const email = req.params.email;

        // database থেকে user খোঁজা
        const user = await usersCollection.findOne({ email });

        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }

        // password ফিল্ড বা sensitive কিছু থাকলে এখানে delete/omit করে পাঠানো ভালো
        // delete user.password; // যদি password ফিল্ড থাকে

        res.status(200).send(user);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });

    // ✅ 1) Get user coins
    app.get("/user/coins", verifyFBToken, async (req, res) => {
      try {
        const email = req.decoded.email;

        const user = await usersCollection.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
          worker_email: email,
          worker_name: user.name,
          totalCoins: user.coins,
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // app.get("/users/summary/total-count", async (req, res) => {
    //   const pipeline = [
    //     {
    //       $group: {
    //         _id: "$total_workers",
    //         count: {
    //           $sum: 1,
    //         },
    //       },
    //     },
    //     {
    //       $project: {
    //         buyer: "$_id",
    //         count: 1,
    //       }
    //     }
    //   ];

    //   const result = await usersCollection.aggregate(pipeline).toArray();
    //   res.send(result);
    // });

    // ================== ADMIN DASHBOARD STATS ==================
    app.get(
      "/dashboard/admin-stats",
      verifyFBToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const totalWorkers = await usersCollection.countDocuments({
            role: "Worker",
          });
          const totalBuyers = await usersCollection.countDocuments({
            role: "Buyer",
          });

          const coinsAgg = await usersCollection
            .aggregate([
              { $group: { _id: null, totalCoins: { $sum: "$coin" } } },
            ])
            .toArray();

          const totalAvailableCoins = coinsAgg[0]?.totalCoins || 0;

          const paymentsAgg = await paymentsCollection
            .aggregate([
              { $group: { _id: null, totalPayments: { $sum: "$amount" } } },
            ])
            .toArray();
          const totalPayments = paymentsAgg[0]?.totalPayments || 0;

          res.send({
            totalWorkers,
            totalBuyers,
            totalAvailableCoins,
            totalPayments,
          });
        } catch (err) {
          res.status(500).send({ message: err.message });
        }
      }
    );

    // ================== WORKER DASHBOARD STATS ==================
    app.get("/dashboard/worker-stats", verifyFBToken, async (req, res) => {
      try {
        console.log("Worker Home", req.decoded);

        const email = req.decoded.email;

        // Total submissions
        const totalSubmissions = await submissionsCollection.countDocuments({
          worker_email: email,
        });

        // Total pending submissions
        const totalPending = await submissionsCollection.countDocuments({
          worker_email: email,
          status: "pending",
        });

        // Total earning (sum of payable_amount where approved)
        const earningsAgg = await submissionsCollection
          .aggregate([
            { $match: { worker_email: email, status: "approved" } },
            {
              $group: { _id: null, totalEarning: { $sum: "$payable_amount" } },
            },
          ])
          .toArray();

        const totalEarning = earningsAgg[0]?.totalEarning || 0;

        res.send({ totalSubmissions, totalPending, totalEarning });
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });

    // ================== BUYER DASHBOARD STATS ==================
    app.get("/dashboard/buyer-stats", verifyFBToken, async (req, res) => {
      try {
        console.log("Buyer Home", req.decoded);

        const email = req.decoded.email;

        // 1️⃣ Total tasks (যতগুলো task buyer add করেছে)
        const totalTasks = await tasksCollection.countDocuments({
          created_by: email,
        });

        // 2️⃣ Total pending workers (sum of required_workers of his tasks)
        const pendingAgg = await tasksCollection
          .aggregate([
            { $match: { created_by: email } },
            {
              $group: {
                _id: null,
                totalPending: { $sum: "$required_workers" },
              },
            },
          ])
          .toArray();
        const totalPending = pendingAgg[0]?.totalPending || 0;

        // 3️⃣ Total payment (sum of total_payable_amount of his tasks)
        const paymentAgg = await tasksCollection
          .aggregate([
            { $match: { created_by: email } },
            {
              $group: {
                _id: null,
                totalPayment: { $sum: "$total_payable_amount" },
              },
            },
          ])
          .toArray();
        const totalPayment = paymentAgg[0]?.totalPayment || 0;

        res.send({ totalTasks, totalPending, totalPayment });
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });

    // ✅ 2) Post withdrawal request
    app.post("/withdrawals", verifyFBToken, async (req, res) => {
      try {
        const {
          withdrawal_coin,
          withdrawal_amount,
          payment_system,
          account_number,
        } = req.body;

        if (!withdrawal_coin || withdrawal_coin < 200) {
          return res
            .status(400)
            .json({ message: "Minimum 200 coins required" });
        }

        // Check user coins
        // const email = req.user.email;
        const email = req.decoded.email;

        const user = await usersCollection.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (withdrawal_coin > user.coins) {
          return res.status(400).json({ message: "Not enough coins" });
        }

        const withdrawDoc = {
          worker_email: email,
          worker_name: user.name,
          withdrawal_coin,
          withdrawal_amount,
          payment_system,
          account_number,
          withdraw_date: new Date(),
          status: "pending",
        };

        await withdrawalsCollection.insertOne(withdrawDoc);

        // Update user coins
        await usersCollection.updateOne(
          { email },
          { $inc: { coins: -withdrawal_coin } }
        );

        res.json({ success: true, message: "Withdrawal request submitted" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // ✅ 3) Admin approve/reject (example)
    app.patch("/withdrawals/:id", async (req, res) => {
      const { id } = req.params;
      const { status } = req.body; // "approved" or "rejected"
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      await withdrawalsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );
      res.json({ success: true, message: `Withdrawal ${status}` });
    });

    // ✅ Get all pending withdrawals
    app.get(
      "/withdrawals/pending",
      verifyFBToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const pending = await withdrawalsCollection
            .find({ status: "pending" })
            .toArray();
          res.json(pending);
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Server error" });
        }
      }
    );

    // ✅ Approve a withdrawal request
    app.patch("/withdrawals/approve/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const withdraw = await withdrawalsCollection.findOne({
          _id: new ObjectId(id),
        });
        console.log("Withdraw amount: ", withdraw);
        if (!withdraw)
          return res.status(404).json({ message: "Request not found" });
        if (withdraw.status === "approved")
          return res.status(400).json({ message: "Already approved" });

        // Update withdraw status
        await withdrawalsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "approved" } }
        );

        // Decrease user coin
        // await usersCollection.updateOne(
        //   { email: withdraw.worker_email },
        //   { $inc: { coins: -withdraw.amount } }
        // );

        res.json({ message: "Withdrawal approved and user coin decreased" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
    });

    // GET /withdrawals/total/:email
    app.get("/withdrawals/total/:email", verifyFBToken, async (req, res) => {
      const email = req.params.email;

      const total = await withdrawalsCollection
        .aggregate([
          { $match: { worker_email: email, status: "approved" } },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$withdrawal_amount" }, // এখানে dollar sum হচ্ছে
            },
          },
        ])
        .toArray();

      res.json({
        totalWithdrawAmount: total[0]?.totalAmount || 0,
      });
    });

    // ---------- CREATE SUBMISSION ----------
    app.post("/submissions", async (req, res) => {
      try {
        const {
          task_id,
          task_title,
          payable_amount,
          worker_email,
          submission_details,
          worker_name,
          buyer_name,
          buyer_email,
        } = req.body;

        const newSubmission = {
          task_id: new ObjectId(task_id),
          task_title,
          payable_amount,
          worker_email,
          worker_name,
          buyer_name,
          buyer_email,
          submission_details,
          current_date: new Date(),
          status: "pending",
        };

        const result = await submissionsCollection.insertOne(newSubmission);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error inserting submission:", error);
        res.status(500).send({ message: "Failed to create submission" });
      }
    });

    // ---------- 1️⃣ GET Pending Submissions for Buyer's Tasks ----------
    app.get("/submissions/pending", verifyFBToken, async (req, res) => {
      try {
        const buyerEmail = req.decoded.email;

        // Find all tasks created by buyer
        const buyerTasks = await tasksCollection
          .find({ created_by: buyerEmail })
          .toArray();
        const taskIds = buyerTasks.map((t) => t._id);

        // Find submissions for these tasks where status = pending
        const submissions = await submissionsCollection
          .find({
            task_id: { $in: taskIds },
            status: "pending",
          })
          .toArray();

        res.send(submissions);
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send({ message: "Failed to fetch pending submissions" });
      }
    });

    // Approve Submission
    app.put("/submissions/approve/:id", async (req, res) => {
      const { id } = req.params;

      try {
        // 1. Find the submission
        const submission = await submissionsCollection.findOne({
          _id: new ObjectId(id),
        });
        if (!submission)
          return res.status(404).send({ message: "Submission not found" });

        // 2. Update worker coins
        const coinsToAdd = submission.payable_amount * 20; // business logic
        await usersCollection.updateOne(
          { email: submission.worker_email },
          { $inc: { coins: coinsToAdd } }
        );

        // 3. Update submission status to approved
        await submissionsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "approved" } }
        );

        res.send({ message: "Submission approved and worker coins updated" });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to approve submission" });
      }
    });

    // Reject Submission
    app.put("/submissions/reject/:id", async (req, res) => {
      const { id } = req.params;

      try {
        // 1. Find the submission
        const submission = await submissionsCollection.findOne({
          _id: new ObjectId(id),
        });
        if (!submission)
          return res.status(404).send({ message: "Submission not found" });

        // 2. Update submission status to rejected
        await submissionsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "rejected" } }
        );

        // 3. Increase required_workers for the task
        await tasksCollection.updateOne(
          { _id: new ObjectId(submission.task_id) },
          { $inc: { required_workers: 1 } }
        );

        res.send({
          message: "Submission rejected and required_workers increased",
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to reject submission" });
      }
    });

    // GET submissions for logged-in worker
    app.get("/submissions/my", verifyFBToken, async (req, res) => {
      try {
        const workerEmail = req.decoded.email; // worker email from JWT/Firebase token

        const submissions = await submissionsCollection
          .find({ worker_email: workerEmail })
          .sort({ current_date: -1 }) // নতুনগুলো উপরে
          .toArray();

        res.send(submissions);
      } catch (error) {
        console.error("Error fetching submissions: ", error);
        res.status(500).send({ message: "Failed to get submissions" });
      }
    });

    // ==================== GET TASKS ====================
    app.get("/tasks", verifyFBToken, async (req, res) => {
      try {
        const userEmail = req.query.email;

        // console.log("Decoded", req.decoded);

        if (req.decoded.email !== userEmail) {
          return res.status(403).send({ message: "Forbidden Access" });
        }

        const query = userEmail ? { created_by: userEmail } : {};
        const options = { sort: { completion_date: -1 } };
        const tasks = await tasksCollection.find(query, options).toArray();
        res.send(tasks);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
        res.status(500).send({ message: "Failed to get tasks data" });
      }
    });

    // ==================== GET TASKS WHERE required_workers > 0 ====================
    app.get("/tasks/available", verifyFBToken, async (req, res) => {
      try {
        // MongoDB query: required_workers greater than 0
        const query = { required_workers: { $gt: 0 } };

        // যদি completion_date দিয়ে sort করতে চাও
        const options = { sort: { completion_date: -1 } };

        const tasks = await tasksCollection.find(query, options).toArray();

        res.send(tasks);
      } catch (error) {
        console.error("Error fetching available tasks: ", error);
        res.status(500).send({ message: "Failed to get available tasks" });
      }
    });

    app.get("/users/:email/role", async (req, res) => {
      try {
        const email = req.params.email;

        if (!email) {
          return res.status(400).send({ message: "Email is not required" });
        }

        const user = await usersCollection.findOne({ email });

        if (!user) {
          return res.status(404).send({ messag: "User not found" });
        }

        res.send({ role: user.role || "worker" });
      } catch (error) {
        console.log("Error getting user role: ", error);
        res.status(500).send({ message: "Failed to get role" });
      }
    });

    // ================ GET SINGLE TASKS ==================
    app.get("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;

        const task = await tasksCollection.findOne({ _id: new ObjectId(id) });

        if (!task) {
          return res.status(404).send({ message: "Task not found" });
        }
        res.send(task);
      } catch (error) {
        console.error("Error fetching task: ", error);
        res.status(500).send({ message: "Failed to fetch task" });
      }
    });

    // ==================== CREATE TASK ====================
    app.post("/tasks", async (req, res) => {
      try {
        const newTask = req.body;
        newTask.completion_date = new Date(newTask.completion_date);

        const result = await tasksCollection.insertOne(newTask);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error inserting Task: ", error);
        res.status(500).send({ message: "Failed to create task" });
      }
    });

    // ==================== UPDATE TASK ====================
    app.put("/tasks/:id", async (req, res) => {
      try {
        const taskId = req.params.id;
        const { task_title, task_detail, submission_info } = req.body;

        const result = await tasksCollection.updateOne(
          { _id: new ObjectId(taskId) },
          { $set: { task_title, task_detail, submission_info } }
        );

        if (result.modifiedCount === 1) {
          res.send({ message: "Task updated successfully" });
        } else {
          res.status(404).send({ message: "Task not found" });
        }
      } catch (error) {
        console.error("Error updating Task: ", error);
        res.status(500).send({ message: "Failed to update task" });
      }
    });

    // ==================== DELETE TASK ====================
    app.delete("/tasks/:id", async (req, res) => {
      try {
        const taskId = req.params.id;
        const task = await tasksCollection.findOne({
          _id: new ObjectId(taskId),
        });

        if (!task) return res.status(404).send({ message: "Task not found" });

        // Delete task
        await tasksCollection.deleteOne({ _id: new ObjectId(taskId) });

        // refill amount calculation
        const refillAmount = task.required_workers * task.payable_amount;
        const isUncompleted = new Date(task.completion_date) < new Date();
        console.log("Ref. Amount: ", refillAmount);
        console.log("Uncompleted: ", isUncompleted);
        // Increase coins if task uncompleted
        let coinsAdded = 0;
        if (isUncompleted) {
          const updateUser = await usersCollection.updateOne(
            { email: task.created_by },
            { $inc: { coins: refillAmount } }
          );
          console.log("Updte User: ", updateUser);
          if (updateUser.modifiedCount === 1) coinsAdded = refillAmount;
        }

        res.send({
          message: "Task deleted",
          refillAmount: coinsAdded,
        });
      } catch (error) {
        console.error("Error deleting Task: ", error);
        res.status(500).send({ message: "Failed to delete task" });
      }
    });

    // Payment Intent
    app.post("/create-payment-intent", async (req, res) => {
      try {
        const { amountInCents } = req.body;
        console.log(amountInCents);
        if (!amountInCents) {
          return res.status(400).send({ error: "Amount is required" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: "usd",
        });

        res.send({ clientSecret: paymentIntent.client_secret });
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
      }
    });

    // ==================== PATCH USER COINS ====================
    app.patch("/users/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const { increment } = req.body;

        const result = await usersCollection.updateOne(
          { email },
          { $inc: { coins: increment } }
        );

        if (result.modifiedCount === 1) {
          res.send({ message: `User coins increased by ${increment}` });
        } else {
          res.status(404).send({ message: "User not found" });
        }
      } catch (error) {
        console.error("Error updating coins: ", error);
        res.status(500).send({ message: "Failed to update coins" });
      }
    });

    // Update user (name, image) by email
    app.put("/users/:email", async (req, res) => {
      const { email } = req.params;
      const { name, image } = req.body;

      if (!name && !image) {
        return res.status(400).json({ message: "Name or image is required" });
      }

      try {
        const updateDoc = {};
        if (name) updateDoc.name = name;
        if (image) updateDoc.image = image;
        updateDoc.last_log_in = new Date(); // optional: last update time

        const result = await usersCollection.updateOne(
          { email },
          { $set: updateDoc }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await usersCollection.findOne({ email });
        res.json(updatedUser);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    // Payment status
    app.get("/payments", verifyFBToken, async (req, res) => {
      try {
        const userEmail = req.query.email;

        console.log("Payment Decoded: ", req.decoded);

        if (req.decoded.email !== userEmail) {
          return res.status(403).send({ message: "Forbidden Access" });
        }

        const query = userEmail ? { email: userEmail } : {};
        const options = { sort: { paid_at: -1 } };

        const payments = await paymentsCollection
          .find(query, options)
          .toArray();

        res.send(payments);
      } catch (error) {
        console.error("Error fetching payment history: ", error);
        res.status(500).send({ message: "Failed to get payments" });
      }
    });

    // Post: Record payment and update parcel status
    app.post("/payments", async (req, res) => {
      try {
        const { email, amount, paymentMethod, transactionId } = req.body;

        const paymentDoc = {
          email,
          amount,
          paymentMethod,
          transactionId,
          paid_at_string: new Date().toISOString(),
          paid_at: new Date(),
        };

        const paymentResult = await paymentsCollection.insertOne(paymentDoc);
        res.status(201).send({
          message: "Payment recorded and parcel marked as parcel",
          insertedId: paymentResult.insertedId,
        });
      } catch (error) {
        console.error("Payment Processing failed: ", error);
        res.status(500).send({ message: "Payment Processing failed" });
      }
    });

    // ✅ Delete a user by id
    app.delete("/users/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await usersCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({ message: "User deleted successfully" });
      } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).send({ message: "Server error" });
      }
    });

    // ✅ Update user role by id
    app.patch(
      "/users/role/:id",
      verifyFBToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const id = req.params.id;
          const { role } = req.body; // body থেকে role আসবে: "Admin" | "Buyer" | "Worker"

          if (!role) {
            return res.status(400).send({ message: "Role is required" });
          }

          const result = await usersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { role } }
          );

          if (result.matchedCount === 0) {
            return res.status(404).send({ message: "User not found" });
          }

          res.status(200).send({ message: "Role updated successfully" });
        } catch (error) {
          console.error("Update Role Error:", error);
          res.status(500).send({ message: "Server error" });
        }
      }
    );

    // ==================== PING ====================
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close(); // keep connection open
  }
}

run().catch(console.dir);

// Simple route
app.get("/", (req, res) => {
  res.send("Workloy Server is running!");
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
