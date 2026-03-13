const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://studybelike:studybelike123@cluster0.mongodb.net/studybelike?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/payment', require('./routes/payment'));

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to StudyBeLike API' });
});

// Sample data endpoint for initial setup
app.get('/api/sample-data', async (req, res) => {
  const User = require('./models/User');
  const Note = require('./models/Note');
  const Article = require('./models/Article');
  
  // Check if data already exists
  const existingNotes = await Note.find();
  const existingArticles = await Article.find();
  
  if (existingNotes.length === 0) {
    // Create sample notes
    const sampleNotes = [
      {
        title: "Digital Electronics Notes",
        subject: "Electronics",
        description: "Complete notes on digital electronics covering logic gates, flip-flops, and digital circuits.",
        pdf_link: "https://example.com/notes/digital-electronics.pdf",
        created_at: new Date()
      },
      {
        title: "C Programming Basics",
        subject: "Programming",
        description: "Fundamentals of C programming including variables, loops, functions, and pointers.",
        pdf_link: "https://example.com/notes/c-programming.pdf",
        created_at: new Date()
      },
      {
        title: "Operating System Notes",
        subject: "Computer Science",
        description: "Operating system concepts including processes, memory management, and file systems.",
        pdf_link: "https://example.com/notes/operating-system.pdf",
        created_at: new Date()
      }
    ];
    await Note.insertMany(sampleNotes);
  }
  
  if (existingArticles.length === 0) {
    // Create sample articles
    const sampleArticles = [
      {
        title: "What is Arduino",
        slug: "what-is-arduino",
        subject: "Arduino",
        content: `
# What is Arduino?

Arduino is an open-source electronics platform based on easy-to-use hardware and software. It's designed for anyone making interactive projects.

## Introduction

Arduino boards are able to read inputs - light on a sensor, a finger on a button, or a Twitter message - and turn it into an output - activating a motor, turning on an LED, publishing something online.

## Arduino Board Components

- **Microcontroller**: The brain of the Arduino
- **Digital I/O pins**: For connecting sensors and actuators
- **Analog pins**: For reading analog sensors
- **Power jack**: For supplying power
- **USB connector**: For programming and power

## Getting Started

1. Download the Arduino IDE
2. Connect your Arduino board
3. Write your first sketch
4. Upload to the board

## Code Example

\`\`\`cpp
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}
\`\`\`

## Applications

- Home automation
- Robotics
- Wearable electronics
- IoT projects
- Educational projects

## Conclusion

Arduino makes electronics accessible to everyone. It's perfect for beginners and professionals alike.
        `,
        author: "StudyBeLike Team",
        created_at: new Date()
      },
      {
        title: "Ultrasonic Sensor Explained",
        slug: "ultrasonic-sensor-explained",
        subject: "Sensors",
        content: `
# Ultrasonic Sensor Explained

Ultrasonic sensors are devices that use ultrasonic waves to measure distance or detect objects.

## How It Works

The sensor emits超声波 (ultrasonic waves) at a frequency above human hearing range (typically 40kHz). When these waves hit an object, they bounce back to the sensor. By measuring the time taken for the waves to return, we can calculate the distance.

## Key Specifications

- **Operating Voltage**: 5V DC
- **Measuring Range**: 2cm to 400cm
- **Accuracy**: 3mm
- **Frequency**: 40kHz

## Pin Configuration

1. **VCC**: Power supply (5V)
2. **Trig**: Trigger pin
3. **Echo**: Echo pin
4. **GND**: Ground

## Circuit Diagram

Connect VCC to 5V, GND to ground, Trig to digital pin 9, and Echo to digital pin 8.

## Code Example

\`\`\`cpp
const int trigPin = 9;
const int echoPin = 8;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH);
  int distance = duration * 0.034 / 2;
  
  Serial.print("Distance: ");
  Serial.println(distance);
}
\`\`\`

## Applications

- Obstacle detection
- Parking sensors
- Level measurement
- Distance sensing
- Robotics navigation

## Advantages

- Non-contact measurement
- High accuracy
- Affordable
- Easy to use
        `,
        author: "StudyBeLike Team",
        created_at: new Date()
      },
      {
        title: "Stack Data Structure",
        slug: "stack-data-structure",
        subject: "Computer Science",
        content: `
# Stack Data Structure

A stack is a linear data structure that follows the LIFO (Last In First Out) principle.

## Introduction

Think of a stack like a pile of plates. You add plates on top and remove them from the top. The last plate you put in is the first one you take out.

## Operations

### Push
Add an element to the top of the stack.

### Pop
Remove and return the top element.

### Peek
Return the top element without removing it.

### isEmpty
Check if the stack is empty.

## Implementation in C

\`\`\`c
#include <stdio.h>
#include <stdlib.h>

#define MAX 100

struct Stack {
  int top;
  int arr[MAX];
};

void initStack(struct Stack* s) {
  s->top = -1;
}

int isFull(struct Stack* s) {
  return s->top == MAX - 1;
}

int isEmpty(struct Stack* s) {
  return s->top == -1;
}

void push(struct Stack* s, int value) {
  if (isFull(s)) {
    printf("Stack Overflow\\n");
    return;
  }
  s->arr[++s->top] = value;
}

int pop(struct Stack* s) {
  if (isEmpty(s)) {
    printf("Stack Underflow\\n");
    return -1;
  }
  return s->arr[s->top--];
}

int peek(struct Stack* s) {
  if (isEmpty(s)) {
    return -1;
  }
  return s->arr[s->top];
}
\`\`\`

## Applications

- Function call management
- Expression evaluation
- Undo mechanisms
- Backtracking algorithms
- Browser history

## Time Complexity

- Push: O(1)
- Pop: O(1)
- Peek: O(1)

## Conclusion

Stacks are fundamental data structures used in many computer science applications. Understanding them is crucial for programming and algorithm design.
        `,
        author: "StudyBeLike Team",
        created_at: new Date()
      }
    ];
    await Article.insertMany(sampleArticles);
  }
  
  res.json({ message: 'Sample data created successfully' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

