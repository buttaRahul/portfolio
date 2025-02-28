
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import React from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { FaKaggle } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";



export default {
    name: 'Rahul Aditya',
    title: 'Machine Learning Engineer',
    birthday: '21st October 2002',
    email: 'butta.rahul.aditya@gmail.com',
    // address: 'SR Nagar Hyderabad'
    phone: '+91 9505867830',
    address: 'Attapur, Hyderabad, Telangana, India',


    links: {
        LinkedIn: {
            link: 'https://www.linkedin.com/in/rahul-aditya/',
            text: 'rahul-aditya',
            icon: React.createElement(LinkedInIcon)
        },
        GitHub: {
            link: 'https://github.com/buttaRahul',
            text: 'buttaRahul',
            icon: React.createElement(GitHubIcon)
        },
        Kaggle: {
            link: 'https://www.kaggle.com/adityarahul',
            text: 'aditya_Rahul',
            icon: React.createElement(FaKaggle)
        },
        LeetCode : {
            link : 'https://leetcode.com/aditya_Rahul/',
            text : 'aditya_rahul',
            icon: React.createElement(SiLeetcode)

        }
    },

    about: "I am a passionate developer with a strong curiosity for Machine Learning and web development. I take pride in building innovative projects and continuously expanding my skill set. I enjoy solving challenges by creating simple and elegant solutions.",
    experiences: [
        {
            title: 'Machine Learning Engineer Intern - Videoverse',
            date: '08/2024 - present',
            description: "Developed an unsupervised learning pipeline to detect events from video data, leveraging video masked encoder models. \n Created a robust client and REST framework server to deploy and perform inference on a trained Visual Language Model (VLM), enabling efficient, scalable inference workflows. \nLeveraged DeepSpeed for mixed precision training of video masked encoder models, optimizing memory usage and training speed without compromising accuracy",
        },
        {
            title: 'Data Science Intern - Dronapay',
            date: '04/2024 - 07/2024',
            description: "Created a deep learning model to generate JsonLogic rules automatically from natural language, cutting down on manual rule writing time and streamlining the decision-making process.\n Fine-tuned LLM's like LLama, Bert, etc and deployed them into production using AWS serverless architecture.\n Contributed on keystroke analysis based on machine learning, which strengthened system security and helped to reduce fraudulent actions by 30%.",
        }
    ],


    education: [
        {
            title: 'Indian Institute of Information Technology(IIIT), Pune',
            date: '2020 - 2024',
            course: 'B.Tech - CSE',
            grade: 'CGPA : 7.3',

        },
        {
            title: 'Rishi Junior College',
            date: '2018 - 2020',
            course: '12th Telangana State Board',
            grade: 'Percentage :95%',
        },
    ],

    skills: [
        {
            title: 'FRONT-END',
            description: ["ReactJS", "JavaScript", "TypeScript", "Material UI"]
        },
        {
            title: 'BACK-END',
            description: ["Python", "Django", "Django Rest Framework", "NodeJS"]
        },
        {
            title: 'ML/DATA SCIENCE',
            description: ["Tensorflow","Pytorch" ,"SpaCy , NLTK", "OpenCv", "Pandas",]
        },
        {
            title: 'DATABASES',
            description: ["MySQL", "PostgreSQL"]
        }
    ],

    projects: [

        {
            tag: 'ML/Data Science',
            image: '../assets/images/enterprise.png',
            title: 'Enterprise Search',
            description: 'An AI-powered search solution for organizations, enabling a unified search across multiple sources like web, databases, company websites, and emails. Built on RAG and LLM, it intelligently processes queries to retrieve and generate relevant responses.',
            tech:["llm", "langchain", "RAG",'React.js','fastAPI'],
            links: [

                { link: 'https://github.com/buttaRahul/enterprise_serach', icon: React.createElement(GitHubIcon) },
                { link: 'https://drive.google.com/file/d/1-LcfZN6QIreU_XQ3xXiSiOBX_Or5yuXh/view', icon: React.createElement(PlayArrowIcon) }

            ]
        },
        {
            tag: 'ML/Data Science',
            image: '../assets/images/video_summary.png',
            title: 'Multimodal video summarizer',
            description: 'Enhanced video summarization by integrating both textual and visual information.',
            tech:["deepseek-llm", "pyav", "opencv", "blip"],
            links: [

                { link: 'https://github.com/buttaRahul/multimodal_video_summarization', icon: React.createElement(GitHubIcon) },
                { link: 'https://drive.google.com/file/d/1O2KA8uTEMT8D5XnuPp-Xz8l9eiKsCDn-/view', icon: React.createElement(PlayArrowIcon) }

            ]
        },
        {
            tag: 'ML/Data Science',
            image: '../assets/images/rag_query.png',
            title: 'RAG Query System',
            description: 'A RAG-based system extracts text from user-provided URLs, stores embeddings in a vector database, and uses an LLM to answer queries with context-specific answers derived solely from the extracted content. It features a robust backend and frontend for seamless interaction.',
            tech:["llm", "RAG", "vectordb", "React.js","fastAPI"],
            links: [

                { link: 'https://github.com/buttaRahul/Rag-QuerySystem', icon: React.createElement(GitHubIcon) },
                { link: 'https://drive.google.com/file/d/1xySCE7QLMmfa02cXi1XwyFTyD0-fqBgY/view', icon: React.createElement(PlayArrowIcon) }

            ]
        },

        {
            tag: 'ML/Data Science',
            image: '../assets/images/query.png',
            title: 'Query Assist',
            description: 'An NLP model which can convert Natural Language verbal specifications (in Telugu or English) into SQL queries and executes it against database. Implemented using SpaCy, Gensim, NLTK, speech_recogniton and torchaudio',
            tech:["Python", "SpaCy", "Gensim", "speech_recognition"],
            links: [

                { link: 'https://github.com/buttaRahul/Query-Assist', icon: React.createElement(GitHubIcon) },

            ]
        },
        {
            tag: 'ML/Data Science',
            image: '../assets/images/caption.png',
            title: 'Image Caption Generation',
            description: 'A Deeplearning, Encoder-Decoder Model to generate text captions from images',
            tech:["Tensorflow", "Keras", "Gensim", "cv2"],
            links: [

                { link: 'https://github.com/buttaRahul/Image-Caption-Generation', icon: React.createElement(GitHubIcon) },

            ]
        },

        {
            tag: 'ML/Data Science',
            image: '../assets/images/time-series.png',
            title: 'Time Series Forecasting on Tesla stocks',
            description: "Developed a time-series forecasting model for Tesla's stock price, leveraging historical stock data and conducting exploratory data analysis (EDA)..",
            tech:["Tensorflow", "Bi-directional LSTM", "seaborn"],
            links: [

                { link: 'https://www.kaggle.com/code/adityarahul/time-series-forecasting-on-tesla-stocks', icon: React.createElement(FaKaggle) },

            ]
        },
        {
            tag: 'ML/Data Science',
            image: '../assets/images/disease.png',
            title: "Parkinson's Disease Progression Prediction",
            description: "Predicted the progression of Parkinson's Disease by utilizing protein and peptide data measurements from data provided in a Kaggle Contest. Implemented using Pandas, Seaborn, Scikit-learn and XGBoost",
            tech: ["Pandas", "Seaborn", "Sklearn", "XGBoost"],
            links: [

                { link: 'https://www.kaggle.com/code/adityarahul/eda-linearregression', icon: React.createElement(FaKaggle) },

            ]
        },
        {
            tag: 'ML/Data Science',
            image: '../assets/images/pepsi.jpg',
            title: 'Pepsi Cocacola video tracking',
            description: "Detect and track 'Pepsi' and 'Coca-Cola' objects in a video, capturing their appearance timestamps and key details such as size and distance from the frame's center.",
            tech:["Yolov8", "OpenCv", "PyAv"],
            links: [

                { link: 'https://www.kaggle.com/code/adityarahul/time-series-forecasting-on-tesla-stocks', icon: React.createElement(FaKaggle) },

            ]
        },


        {
            tag: 'ML/Data Science',
            image: '../assets/images/ocrner.png',
            title: 'Ocr-Ner',
            description: 'An end-to-end pipeline to extract named entities from Pdf or Image files',
            tech:["Transformers", "Bert","Pandas", "FastApi"],
            links: [

                { link: 'https://github.com/buttaRahul/ocr-ner', icon: React.createElement(GitHubIcon) },

            ]
        },
        {
            tag: 'ML/Data Science',
            image: '../assets/images/road.png',
            title: 'Road Sign Detection',
            description: 'A deep learning model to detect road signs using YOLOv8',
            tech:["Ultralytics", "YOLOv8","cv2"],
            links: [

                { link: 'https://github.com/buttaRahul/road-sign-detection/', icon: React.createElement(GitHubIcon) },

            ]
        },

        

        {
            tag: 'ML/Data Science',
            image: '../assets/images/mouse.jpg',
            title: 'virtual Mouse',
            description: 'A computer vision program to control your mouse pointer and click using hand gestures.Implented using OpenCV, Mediapipe Landmarks.',
            tech:["OpenCV", "Mediapipe", "pyautogui"],
            links: [

                { link: 'https://github.com/buttaRahul/virtual-mouse', icon: React.createElement(GitHubIcon) },

            ]
        },

        {
            tag: 'ML/Data Science',
            image: '../assets/images/news.png',
            title: 'Fake News Detection',
            description: 'A supervised machine learning model to detect Fake News articles Implemented using scikit-learn, NLTK, BERT-Encoder ',
            tech:["Scikit-learn", "NLTK", "BERT"],
            links: [

                { link: 'https://github.com/buttaRahul/Fake-news-detection', icon: React.createElement(GitHubIcon) },

            ]
        },
        
     
        {
            tag: 'ML/Data Science',
            image: '../assets/images/sentiment.jpg',
            title: 'Twitter Sentiment Analysis',
            description: 'A supervised machine learning model to predect sentiment of tweets ',
            tech:["Scikit-learn", "SpaCy", "NLTK"],
            links: [

                { link: 'https://github.com/buttaRahul/twitter_sentiment_analysis', icon: React.createElement(GitHubIcon) },
                // { link: 'https://buttarahul.github.io/currency-converter//', icon: React.createElement(PlayArrowIcon) },

            ]
        },
        {
            tag: 'ML/Data Science',
            image: '../assets/images/accident.jpg',
            title: 'Accident Severity Classification',
            description: 'A supervised learning approach to classify accident severity',
            tech:["Scikit-learn", "Tensorflow", "Pandas"],
            links: [

                { link: 'https://github.com/buttaRahul/accident-Severity-classification/', icon: React.createElement(GitHubIcon) },
                // { link: 'https://buttarahul.github.io/currency-converter//', icon: React.createElement(PlayArrowIcon) },

            ]
        },
        
        
        {
            tag: 'ML/Data Science',
            image: '../assets/images/lab.jpg',
            title: 'ML Lab Work',
            description: 'Machine Learning lab work done during ML course at IIITP',
            tech:["Python", "scikitlearn", "tensorflow"],
            links: [

                { link: 'https://github.com/buttaRahul/IIITP-ML-Lab', icon: React.createElement(GitHubIcon) },

            ]
        },
        
        
        {
            tag: 'ML/Data Science',
            image: '../assets/images/bird.png',
            title: "EDA BirdCLEF",
            description: "Exploratory data analysis (EDA) of audio sounds of different species of birds Implemented using torchaudio, seaborn and librosa",
            tech:["torchaudio", "Seaborn", "librosa"],
            links: [

                { link: 'https://www.kaggle.com/code/adityarahul/edabirdclef', icon: React.createElement(FaKaggle) },

            ]
        },
        {
            tag: 'ML/Data Science',
            image: '../assets/images/movie.png',
            title: "Movie Genre Classification",
            description: "Text Classification problem where I used movie plot summaries to predict movie genres. Implemente using Spacy, NLTK and scikit-learn" ,
            tech:["torchaudio", "Seaborn", "librosa"],
            links: [

                { link: 'https://www.kaggle.com/code/adityarahul/movie-genre-classification', icon: React.createElement(FaKaggle) },

            ]
        },
        {
            tag: 'ML/Data Science',
            image: '../assets/images/disaster.jpg',
            title: "Fake Disaster Tweet Detection",
            description: "A NLP approach to classify a tweet as a Real or Fake Disaster Tweet. Implemented using NLTK and scikit-learn",
            tech: ["NLTK", "Scikit-learn"],
            links: [

                { link: 'https://www.kaggle.com/code/adityarahul/disaster-tweets-prediction-using-nlp', icon: React.createElement(FaKaggle) },

            ]
        },
        {
            tag: 'Web Apps',
            image: '../assets/images/postman.png',
            title: 'Postman Clone',
            description: 'Redesigned the Postman application to enhance the user experience for testing API requests, with improved query parameter handling, headers management, and JSON options Using ReactJs and Material UI.',
            tech: ["ReactJs","Material UI"],
            links: [

                { link: 'https://github.com/buttaRahul/postman-clone', icon: React.createElement(GitHubIcon) },
                { link: 'https://postman-clone-buttarahul.netlify.app/', icon:React.createElement(PlayArrowIcon) }

            ]
        },

        {
            tag: 'Web Apps',
            image: '../assets/images/crypto.png',
            title: 'Cryptocurrency Tracker',
            description: 'A Web application for real-time tracking of cryptocurrencies. Users can track the value of cryptocurrencies in real time, allowing them to make informed decisions about buying, selling, or holding assets. Implemented Using ReactJs, Material UI and ReactchartJS.',
            tech: ["ReactJs","Material UI", "ReactchartJS"],
            links: [

                { link: 'https://github.com/buttaRahul/react-crypto-tracker', icon: React.createElement(GitHubIcon) },
                { link: 'https://cryptotracker-buttarahul.netlify.app/', icon: React.createElement(PlayArrowIcon) }

            ]
        },
        {
            tag: 'Web Apps',
            image: '../assets/images/cal.png',
            title: 'Emi Calculator',
            description: 'Created a calculator application that helps you to calculate the EMI, monthly interest, and monthly reducing balance based on principal amount, loan tenure, and interest rate. Implemented using React.js and Timeline Component from Material UI',
            tech:["ReactJS","Material Ui"],
            links: [

                { link: 'https://github.com/buttaRahul/emi-calculator', icon: React.createElement(GitHubIcon) },
                { link: 'https://buttarahul.github.io/emi-calculator/', icon: React.createElement(PlayArrowIcon) }

            ]
        },
        {
            tag: 'Web Apps',
            image: '../assets/images/todo.png',
            title: 'Todo Application',
            description: 'Created a full-stack Todo list app that helps you keep track of your daily tasks using Django, ReactJS and Material UI',
            // tech:"Django, ReactJS, Material Ui",
            tech: ["Django","ReactJS","Material UI"],
            links: [

                { link: 'https://github.com/buttaRahul/full_stack_django_rest_react/tree/main/todo', icon: React.createElement(GitHubIcon) },

            ]
        },
        {
            tag: 'Web Apps',
            image: '../assets/images/dashboard.png',
            title: 'Dashboard',
            description: 'A Responsive React Dashboard created using ReactJS, recharts and SCSS',
            tech:["ReactJS","recharts","SCSS"],
            links: [

                { link: 'https://github.com/buttaRahul/React-Dashboard', icon: React.createElement(GitHubIcon) },
                { link: 'https://react-dashboard-buttarahul.netlify.app/', icon: React.createElement(GitHubIcon) },

            ]
        },
        
        {
            tag: 'Web Apps',
            image: '../assets/images/monitor.png',
            title: 'Applinace Monitor',
            description: 'Appliance Monitor to check the up-time of various appliances. Implemented using ReactJS',
            tech:["ReactJS"],
            links: [

                { link: 'https://github.com/buttaRahul/appliance-monitor', icon: React.createElement(GitHubIcon) },
                { link: 'https://buttarahul.github.io/appliance-monitor/', icon: React.createElement(PlayArrowIcon) },

            ]
        },
        {
            tag: 'Web Apps',
            image: '../assets/images/boxoffice.png',
            title: 'Box office',
            description: 'An application to search movies, actors and a feature to set favourites. Implemented using ReactJS',
            tech:["ReactJS"],
            links: [

                { link: 'https://github.com/buttaRahul/box-office', icon: React.createElement(GitHubIcon) },
                { link: 'https://buttarahul.github.io/box-office/', icon: React.createElement(PlayArrowIcon) },

            ]
        },

        {
            tag: 'Web Apps',
            image: '../assets/images/convert.png',
            title: 'Currency Converter',
            description: 'Simple tool to convert foreign currencies to Indian rupees. Implemented using ReactJS,',
            tech:["ReactJS"],
            links: [

                { link: 'https://github.com/buttaRahul/currency-converter', icon: React.createElement(GitHubIcon) },
                { link: 'https://buttarahul.github.io/currency-converter//', icon: React.createElement(PlayArrowIcon) },

            ]
        },
        {
            tag: 'Web Apps',
            image: '../assets/images/task.png',
            title: 'Task Management System',
            description: 'created a RESTful API for a task management system using Django Rest Framework. The API supports CRUD operations (Create, Read, Update, Delete) for tasks. Implemented using Django Rest Framework',
            tech:["Python","Django","Django-Rest-Framework"],
            links: [

                { link: 'https://github.com/buttaRahul/task_management', icon: React.createElement(GitHubIcon) },
                // { link: 'https://buttarahul.github.io/currency-converter//', icon: React.createElement(PlayArrowIcon) },

            ]
        },

        {
            tag: 'Web Apps',
            image: '../assets/images/chatbot.png',
            title: "AI ChatBot",
            description: "AI ChatBot Implemented using React.js, Chakra UI and OpenAi Api",
            tech: ["React.js", "Chakra UI"],
            links: [

                { link: 'https://github.com/buttaRahul/chatbot-react', icon: React.createElement(GitHubIcon) },
                { link: 'https://reactchat-bot.netlify.app/', icon: React.createElement(PlayArrowIcon) },

            ]
        },
        {
            tag: 'Web Apps',
            image: '../assets/images/tunes.png',
            title: "Favorite Tunes",
            description: "A Django application that allows users to add and display their favourite songs and the artists who perform them",
            tech: ["Python", "Django"],
            links: [

                { link: 'https://github.com/buttaRahul/FavoriteTunes', icon: React.createElement(GitHubIcon) },

            ]
        },
        
        {
            tag: 'Web Apps',
            image: '../assets/images/tic.png',
            title: 'Tic-Tac-Toe',
            description: 'A tictactoe game using react. Implemted using ReactJs and Javascript',
            tech: ["ReactJs", "Javascript"],
            links: [

                { link: 'https://github.com/buttaRahul/tictactoe', icon: React.createElement(GitHubIcon) },

            ]
        },
        {
            tag: 'C++',
            image: '../assets/images/sys.png',
            title: 'System Monitor',
            description: 'A program that monitors system performance and provides real-time information about CPU, memory, and disk usage and alerts for high CPU usage or low disk space. Implemented using C++',
            tech: ["C++"],
            links: [

                { link: 'https://github.com/buttaRahul/system-monitor', icon: React.createElement(GitHubIcon) },
                // { link: 'https://buttarahul.github.io/currency-converter//', icon: React.createElement(PlayArrowIcon) },

            ]
        },
        {
            tag: 'C++',
            image: '../assets/images/gg.png',
            title: 'Ticket Booking System',
            description: 'A simple ticket booking system for movies implemented by using OOPS concepts in C++',
            tech: ["C++"],
            links: [

                { link: 'https://github.com/buttaRahul/Ticket-booking-system', icon: React.createElement(GitHubIcon) },
                // { link: 'https://buttarahul.github.io/currency-converter//', icon: React.createElement(PlayArrowIcon) },

            ]
        },

        
    
    ]

 
} 