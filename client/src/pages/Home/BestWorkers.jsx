import { workers } from "./FakeData/workers";

export default function BestWorkers() {
  const topWorkers = [...workers].sort((a, b) => b.coins - a.coins).slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className=" mb-15">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-brand-dark">
          <p className="mb-2"> 🌟 </p> <p>Best Workers</p>
        </h2>
        <p className="text-base text-natural max-w-3xl mx-auto text-center">
          Meet our top-performing professionals who have earned the highest
          coins through their dedication and outstanding work. Discover the
          talent that drives our community forward.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {topWorkers.map((worker) => (
          <div
            key={worker.id}
            className="card bg-natural-dark shadow-xl hover:shadow-2xl transition-shadow border border-gray-100"
          >
            <figure className="px-10 pt-10">
              <img
                src={worker.photo}
                alt={worker.name}
                className="rounded-full w-24 h-24 object-cover border-4 border-brand-light"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h3 className="card-title text-lg font-semibold text-brand-light">
                {worker.name}
              </h3>
              <p className="text-natural-light">
                Available Coins:
                <span className="ml-1 font-bold text-accant">{worker.coins}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
