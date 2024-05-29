import {
  LocateIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  YoutubeIcon,
} from "lucide-react";
import React from 'react';
  
  // Mock data for services
  export const services: any = [
    {
      title: "ELECTRONIC MEDICAL RECORD SYSTEMS",
      description: "As OpenMRS implementers, we will rapidly provide your healthcare facility with a tailored, affordable and easy-to-learn solution."
    },
    {
      title: "SECURITY PRINTING",
      description: "Health Care Cards, Patient ID, Insurance Cards, ID Card System, Software and Printer Support. At Logiic we offer a variety of support options to help you get the best out of your system – from high-quality training and installation through to a full, on-site support service."
    },
    {
      title: "ENTERPRISE RESOURCE  PLANNING",
      description: "Logiic offers you world’s most customizable, reliable and Advance open source ERP. "
    },
    {
      title: "OPEN-MRS IMPLEMENTATION AND SUPPORT",
      description: "We, at Logiic, provide Support Packages and AMC (Annual Maintenance Contract) for OpenMRS. This is a suitable option for customers who require minor customization over a longer period of time and are interested in paying for just a few hours of customization instead of going for entire project cost. AMC and Support Packages can also save you from the pain of having in-house programmers and technicians to maintain your OpenMRS applications."
    },
    {
      title: "Web Development",
      description: "Building responsive and modern web applications."
    },
    {
      title: "Mobile App Development",
      description: "Delivering impactful mobile apps that your users will love."
    },
    {
      title: "Cloud Services",
      description: "Providing scalable and secure cloud solutions."
    }
  ];
  
  // Mock data for projects
  export const projects: any = [
    {
      title: "E-commerce Platform",
      description: "A comprehensive platform for online shopping with payment integration.",
      completionDate: "2023-05-15",
      toolsUsed: ["React", "Node.js", "MongoDB", "Stripe API"],
      owner: "Alice Johnson",
      projectImg: "/logiic-EMRS-1-2048x1152.jpg",
      projectUrl: "https://example.com/e-commerce-platform"
    },
    {
      title: "Social Media App",
      description: "A social media application with real-time messaging and media sharing features.",
      completionDate: "2022-11-30",
      toolsUsed: ["React Native", "Firebase", "Redux"],
      owner: "Bob Smith",
      projectImg: "/logiic-EMRS-1-2048x1152.jpg",
      projectUrl: "https://example.com/social-media-app"
    },
    {
      title: "Corporate Website",
      description: "A professional website for a corporate client showcasing their services and portfolio.",
      completionDate: "2023-02-20",
      toolsUsed: ["Next.js", "TypeScript", "GraphQL"],
      owner: "Charlie Davis",
      projectImg: "/logiic-EMRS-1-2048x1152.jpg",
      projectUrl: "https://example.com/corporate-website"
    },
    {
      title: "Healthcare Portal",
      description: "A portal for managing patient information and appointments.",
      completionDate: "2023-08-10",
      toolsUsed: ["Angular", "Node.js", "PostgreSQL"],
      owner: "Dana Lee",
      projectImg: "/logiic-EMRS-1-2048x1152.jpg",
      projectUrl: "https://example.com/healthcare-portal"
    },
    {
      title: "IoT Home Automation",
      description: "A system for controlling home devices remotely via a mobile app.",
      completionDate: "2023-01-05",
      toolsUsed: ["Flutter", "Dart", "AWS IoT"],
      owner: "Ethan Brown",
      projectImg: "/logiic-EMRS-1-2048x1152.jpg",
      projectUrl: "https://example.com/iot-home-automation"
    }
  ];

  export const footerServices: any = [
    {
      id: "service1",
      title: "Software Development and Implementation",
      description:
        "Providing custom software development and implementation services tailored to meet your business needs.",
    },
    {
      id: "service2",
      title: "Mobile App Development",
      description:
        "Creating intuitive and user-friendly mobile applications for both iOS and Android platforms.",
    },
    {
      id: "service3",
      title: "Web Development",
      description:
        "Designing and developing responsive and robust web applications to enhance your online presence.",
    },
    {
      id: "service4",
      title: "Electronic Medical Record Systems",
      description:
        "Developing and implementing electronic medical record systems to streamline healthcare operations.",
    },
    {
      id: "service5",
      title: "Security Printing",
      description:
        "Offering advanced security printing solutions to safeguard your documents and data.",
    },
    {
      id: "service6",
      title: "Enterprise Resource Planning Systems (ERP)",
      description:
        "Implementing ERP systems to optimize and manage your business processes efficiently.",
    },
  ];

  export const contactInfo: any = [
    {
      text: "2nd floor, volkswagen building, Free zone, Kigali",
      icon: React.createElement(LocateIcon, { className: "w-5 h-5 inline-block mr-2" }) as unknown as typeof LocateIcon,
    },
    {
      text: "+ 250 785 242 034",
      icon: React.createElement(PhoneIcon, { className: "w-5 h-5 inline-block mr-2" }) as unknown as typeof PhoneIcon,
    },
    {
      text: "info@logiic.com",
      icon: React.createElement(MailIcon, { className: "w-5 h-5 inline-block mr-2" }) as unknown as typeof MailIcon,
    },
    {
      text: "Mon-Fri 8:00am-18:00pm",
      icon: React.createElement(ClockIcon, { className: "w-5 h-5 inline-block mr-2" }) as unknown as typeof ClockIcon,
    },
  ];
  