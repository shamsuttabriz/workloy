import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Static Testimonial Data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    photo: "https://i.pravatar.cc/100?img=5",
    quote:
      "Workloy helped me connect with talented developers. The platform is smooth and reliable!",
  },
  {
    id: 2,
    name: "Michael Lee",
    photo: "https://i.pravatar.cc/100?img=8",
    quote:
      "Amazing experience! I found top-notch professionals and the process was seamless.",
  },
  {
    id: 3,
    name: "Emily Davis",
    photo: "https://i.pravatar.cc/100?img=10",
    quote:
      "I loved how easy it was to get started and find the right people for my project.",
  },
  {
    id: 4,
    name: "David Carter",
    photo: "https://i.pravatar.cc/100?img=12",
    quote:
      "Great community and fantastic support. Workloy made collaboration effortless for our team.",
  },
  {
    id: 5,
    name: "Sophia Williams",
    photo: "https://i.pravatar.cc/100?img=14",
    quote:
      "The interface is clean and user-friendly. I quickly found the experts I needed.",
  },
];

const Testimonial = () => {
  return (
    <section className="py-12 mt-5 mb-16">
      <div className="max-w-5xl mx-auto px-4 text-center">
        {/* Heading */}
        <div className="space-y-2">
          <p className="text-3xl">📝</p>
          <h2 className="text-3xl font-bold text-brand-dark mb-3">
            What Our Users Say
          </h2>
          <p className="max-w-3xl mx-auto text-center text-natural mb-8">
            Hear from our satisfied users who have discovered the true value of
            Workloy—building strong connections, collaborating seamlessly, and
            achieving their goals with the help of our vibrant developer
            community.
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="w-full"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-natural-dark shadow-md rounded-xl p-8 max-w-xl mx-auto">
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-20 h-20 mx-auto rounded-full mb-4 border-4 border-brand-light"
                />
                <p className="text-natural-light italic mb-4">“{item.quote}”</p>
                <h3 className="text-lg font-semibold text-brand-light">
                  {item.name}
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonial;
