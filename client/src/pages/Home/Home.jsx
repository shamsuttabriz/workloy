import React from "react";
import Banner from "./Banner";
import BestWorkers from "./BestWorkers";
import Testimonial from "./Testimonial";
import FeaturedProjects from "./FeaturedProjects";
import PricingPlans from "./PricingPlans";
import DeveloperResources from "./DeveloperResources";

export const Home = () => {
  return (
    <div>
      <Banner />
      <BestWorkers />
      <Testimonial />
      <FeaturedProjects />
      <PricingPlans />
      <DeveloperResources />
    </div>
  );
};
