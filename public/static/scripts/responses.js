

    const stressQuestions = [
        {
            question: "How are you",
            response: "I am doing great.What about you?"
        },
        {
            question: "stressed",
            response: "Can you be more specific"
        },
        {
            question: "I am feeling low",
            response: "Can you be more specific"
        },
          {
            question: "i'm stressed",
            response: "oops, thats sad,Would you like to share"
        },
        
        {
            question: "I'm feeling really stressed out at work. What should I do?",
            response: "I'm sorry to hear that you're feeling stressed at work. It's important to take breaks, prioritize tasks, and consider talking to your supervisor or HR about your workload. Additionally, relaxation techniques like deep breathing and exercise can help manage stress."
        },
        {
            question: "How can I deal with stress before an important exam?",
            response: "Stress before exams is common. Try to create a study schedule, get enough rest, and practice relaxation techniques like mindfulness or meditation. Remember to stay hydrated and eat well-balanced meals."
        },
        {
            question: "I can't sleep because of stress. What can I do",
            response: "Difficulty sleeping due to stress is common. Establish a bedtime routine, avoid caffeine and screens before bedtime, and consider relaxation exercises. If the problem persists, consult a healthcare professional."
        },
        {
            question: "What are some signs of stress I should watch out for?",
            response: "Signs of stress can include increased heart rate, muscle tension, irritability, and changes in sleep patterns. It's important to recognize these signs early and take steps to manage stress."
        },
        {
            question: "How can I reduce stress in my daily life?",
            response: "To reduce daily stress, try to maintain a healthy work-life balance, engage in physical activity, practice mindfulness, and maintain a support network of friends and family. Seek professional help if needed."
        },
        {
            question: "I'm feeling overwhelmed at work. What should I do",
            response: "It's common to feel overwhelmed at times. Try prioritizing tasks, taking short breaks, and discussing your workload with your supervisor. Remember to practice stress-relief techniques like deep breathing."
        },
        {
            question: "I have a major exam coming up, and I'm stressed out",
            response: "Stress before exams is natural. Create a study schedule, get enough rest, and consider using study aids like flashcards. Don't forget to take breaks to recharge"
        },
        {
            question: "I can't sleep because of stress",
            response: "Trouble sleeping due to stress is common. Establish a bedtime routine, avoid caffeine before bedtime, and try relaxation techniques like meditation or reading"
        },
        {
            question: "What are the signs of stress",
            response: "Common signs of stress include increased heart rate, muscle tension, irritability, and changes in sleep patterns. It's essential to recognize these signs early and take steps to manage stress"
        },
        {
            question: "I'm stressed about an upcoming presentation.",
            response: "Feeling anxious before presentations is normal. Prepare well, practice your speech, and consider using relaxation techniques. Visualizing a successful outcome can also help"
        },
        {
            question: "I'm stressed due to family conflicts",
            response: "Family conflicts can be challenging. Try open communication, active listening, and conflict resolution techniques. If needed, consider family counseling to address underlying issues"
        },
        {
            question: "I'm stressed about my financial situation",
            response: "Financial stress is common. Create a budget, seek financial advice, and explore ways to increase income or reduce expenses. A financial counselor can provide guidance"
        },
        {
            question: "I get anxious in social situations",
            response: "Social anxiety can be managed. Gradual exposure to social settings, self-confidence exercises, and seeking support from a therapist or support group can help"
        },
        {
            question: "How can I manage stress",
            response: "To manage stress, try relaxation techniques like deep breathing and meditation, maintain a balanced diet, exercise regularly, and practice time management. Seeking support from friends, family, or a therapist can also help"
        },
        {
            question: "What are the symptoms of anxiety",
            response: "Common symptoms of anxiety include excessive worry, restlessness, rapid heartbeat, muscle tension, and difficulty concentrating. If you experience these symptoms frequently, consider seeking professional help"
        },
        {
            question: "I think I might be depressed",
            response: "I'm here to listen. It's important to talk to a mental health professional about your feelings. They can provide an accurate diagnosis and treatment options, which may include therapy or medication"
        },
        {
            question: "What are some self-care tips for mental health",
            response: "Self-care includes activities that promote mental well-being. Prioritize self-care by getting enough sleep, practicing mindfulness, maintaining a healthy routine, and engaging in hobbies you enjoy"
        },
        {
            question: "I'm feeling suicidal",
            response: "I'm really sorry to hear that you're feeling this way, but I can't provide the help that you need. It's important to talk to someone who can, though, such as a mental health professional or a trusted person in your life"
        },
        {
            question: "I've lost a loved one, and I'm struggling to cope",
            response: "I'm so sorry for your loss. Grieving is a natural process. Reach out to a grief counselor or a support group for guidance and emotional support during this difficult time"
        },
        {
            question: "How can I cope with panic attacks",
            response: "During a panic attack, practice deep breathing, ground yourself in the present by naming five things you see, four things you touch, three things you hear, two things you smell, and one thing you taste. Seeking professional help for panic disorder is advisable"
        },
        {
            question: "How can I find a therapist or counselor",
            response: "To find a theraphist or counselor,you can go to our website homepage and visit experts"
        },
        {
            question: "I'm feeling extremely tired",
            response: "Persistent fatigue can result from various factors, including depression or other medical conditions. It's advisable to consult a healthcare professional for a thorough evaluation"
        },
        {
            question: "I've lost interest in activities I used to enjoy. Is this a normal phase",
            response: "Losing interest in previously enjoyed activities can be a sign of depression. It's essential to explore these feelings with a mental health professional to work toward a positive change"
        },
        

        



        
    ];
    
    // Sample function to simulate chatbot responses
    function getChatbotResponse(userQuestion) {
        for (const item of stressQuestions) {
            if (userQuestion.toLowerCase().includes(item.question.toLowerCase())) {
                return item.response;
            }
        }
        // If no specific response is found, provide a general response
        return "I'm here to help. If you're feeling stressed, it's essential to talk to someone you trust, such as a friend, family member, or mental health professional. ";
    }
    
    // Example usage
    const userQuestion = "I'm feeling really stressed out at work. What should I do?";
    const chatbotResponse = getChatbotResponse(userQuestion);
    console.log(chatbotResponse);
    //rock paper scissors
    