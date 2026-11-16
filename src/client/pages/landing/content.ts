// The fictional courier session shown on the landing page and at /example.
// Nothing here comes from a real person; it is the same session in every place.

export const REPO_URL = "https://github.com/localnori1/mise";

export const TOPICS = ["Your day-to-day", "Where it hurts", "What it should do", "What matters"];

export type ExampleRequirement = {
  id: string;
  text: string;
  shortText: string; // fits the small document excerpt on the landing page
  priority: "Must have" | "Nice to have";
  source: string; // the question the requirement came from
  quote: string; // the respondent's answer to that question
};

export const EXAMPLE_REQUIREMENTS: ExampleRequirement[] = [
  {
    id: "BR-01",
    text: "Unclaimed bookings shall be offered to available riders automatically.",
    shortText: "Unclaimed bookings shall be offered to available riders automatically.",
    priority: "Must have",
    source: "Q3",
    quote: "I call riders one by one, sometimes forty minutes on the phone.",
  },
  {
    id: "BR-02",
    text: "The dispatcher shall see which riders are available in real time.",
    shortText: "The dispatcher shall see which riders are available in real time.",
    priority: "Must have",
    source: "Q4",
    quote: "I check the group chat to see who said they’re free.",
  },
  {
    id: "BR-03",
    text: "The dispatcher shall be alerted when a booking sits unclaimed beyond a set time.",
    shortText: "The dispatcher shall be alerted when a booking sits unclaimed.",
    priority: "Must have",
    source: "Q2",
    quote: "It sat in the app for about fifteen minutes before I noticed.",
  },
  {
    id: "BR-04",
    text: "Customers shall be notified when a rider is assigned.",
    shortText: "Customers shall be told when a rider is assigned.",
    priority: "Nice to have",
    source: "Q5",
    quote: "The customer messages asking where the rider is.",
  },
];

export const EXAMPLE_ANSWERS = [
  { q: "Q2", question: "Walk me through the last booking that went unclaimed. What happened first?", answer: "It sat in the app for about fifteen minutes before I noticed." },
  { q: "Q3", question: "When a booking goes unclaimed, what happens next?", answer: "I call riders one by one, sometimes forty minutes on the phone." },
  { q: "Q4", question: "How do you know who to call?", answer: "I guess. I check the group chat to see who said they’re free." },
  { q: "Q5", question: "Who else is affected while you’re calling around?", answer: "The customer. They message asking where the rider is." },
];

export const PROBLEM_STATEMENT =
  "Unclaimed bookings are noticed late and reassigned by phone, one rider at a time. The dispatcher has no reliable view of which riders are available, so reassignment depends on guesswork and chat messages.";

export const PRIORITY_OPTIONS = ["Must have", "Nice to have", "Not needed"];
