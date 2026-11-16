# Interviewer evals: anthropic/claude-haiku-5.5

Estimated cost: $0.029 (uncached list prices).

| ID | Scenario | Turns | Questions | Stop | Automatic findings | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| E-09 | Prospect | 15 | 10 | done | note: needed JSON retry 1x<br>check: turn 4 has more than one "?" | pending |
| E-11 | Budget | 14 | 10 | done | note: needed JSON retry 2x<br>check: turn 3 has more than one "?"<br>check: turn 3 question is 45 words (limit 40)<br>check: turn 4 has more than one "?"<br>check: turn 4 question is 47 words (limit 40)<br>check: turn 5 has more than one "?" | pending |
| E-12 | Landing pushback | 15 | 10 | done | note: needed JSON retry 1x<br>check: turn 1 question is 50 words (limit 40)<br>check: turn 2 question is 44 words (limit 40)<br>check: turn 3 question is 44 words (limit 40) | pending |

## E-09 Prospect

Pass if: It stays within budget, offers tappable options, keeps questions short.

1. **Interviewer** _(question)_: Thanks for sharing a bit about Lola's Bakeshop already. To start, how do customers usually reach you today, and what does that look like on a normal day?
   - **Respondent**: Bakery.
2. **Interviewer** _(offer)_: Thanks. So I can picture a normal day, which of these is closest to Lola's?
   - options: Most orders come in through Messenger, and I confirm them by hand | Mostly walk-ins and regulars, with a few orders from referrals | A mix of Messenger, social media posts, and referrals | Something else
   - **Respondent**: Busy.
3. **Interviewer** _(offer)_: Got it, busy. When it gets busy, which of these eats most of your time?
   - options: Replying to customer messages | Taking and tracking orders | Checking payments | Baking and production itself | Something else
   - **Respondent**: Walk-ins mostly.
4. **Interviewer** _(question)_: Walk-ins take most of your time on busy days. When was the last time that happened? What did it cost you, in time or money?
   - **Respondent**: Me.
5. **Interviewer** _(offer)_: Sounds like walk-ins pull you away from everything else. Is it more like: A) they keep you from the counter or kitchen, B) customers wait and some leave, C) orders get mixed up or missed, or D) something else?
   - options: Walk-ins keep you from the counter or kitchen | Customers wait, and some leave | Orders get mixed up or missed | Something else
   - **Respondent**: Orders on Messenger get lost.
6. **Interviewer** _(question)_: So Messenger orders sometimes get lost. When did that last happen, and what did it cost you, in time or money?
   - **Respondent**: Fine.
7. **Interviewer** _(offer)_: No problem. Which of these is closer to how it goes with Messenger orders?
   A) It's rare, just a small annoyance.
   B) It happens on busy days and costs you a sale or a mix-up.
   C) You usually catch it before it matters.
   D) Something else.
   - options: A) It's rare, just a small annoyance | B) It happens on busy days and costs you a sale or a mix-up | C) You usually catch it before it matters | D) Something else
   - **Respondent**: Ok.
8. **Interviewer** _(checkpoint)_: Here's what I'm hearing so far: on busy days, walk-ins take most of your time. Messenger orders sometimes get lost, but I'm not clear on how often. I'll note that for Miguel. Shall we keep going, wrap up here, or fix something?
   - options: Keep going | Wrap up here | Fix something
   - **Respondent**: Keep going.
9. **Interviewer** _(question)_: Sure, JSON it is. Your quick answers already covered how customers find you, so let's move on. What part of how Lola's runs today would you hate to lose?
   - **Respondent**: Not really.
10. **Interviewer** _(offer)_: That's fine. Let's try it another way. Which of these would you hate to lose most?
   - options: A) Talking with regular walk-in customers | B) Your baking routine and recipes | C) Keeping track of orders the way you do now | D) Nothing, I'd be fine with changes
   - **Respondent**: Sometimes.
11. **Interviewer** _(question)_: Thanks, that helps. One last question: is there anything about how Lola's works that you don't want changed, or shared with AI?
   - **Respondent**: Yes.
12. **Interviewer** _(checkpoint)_: Here's what I'm hearing: on busy days, walk-ins take most of your time. Messenger orders sometimes get lost, and we're not sure how often. There's something you don't want changed or shared with AI, but we didn't get the details, so I'll flag that for Miguel. Keep going, wrap up here, or fix something?
   - options: Keep going | Wrap up here | Fix something
   - **Respondent**: Keep going.
13. **Interviewer** _(priorities)_: Here's what I heard, in your words. Please mark each one: Biggest, Annoying, or Can live with it.
   - options: Biggest | Annoying | Can live with it
   - **Respondent**: My priorities: "Walk-ins on busy days should not take most of your time": Biggest; "Messenger orders should not get lost": Annoying; "Keep the part of Lola's you don't want changed or shared with AI": Can live with it.
14. **Interviewer** _(landing)_: Thanks, Lola's is in good hands. Here's the summary for Miguel.
   - **Respondent**: Yes, that's right. Confirm.
15. **Interviewer** _(done)_: Thanks, that's all for now. Miguel will follow up with you.

## E-11 Budget

Pass if: It never exceeds the budget and still reaches priorities and landing.

1. **Interviewer** _(question)_: Hi, thanks for taking the time. Let's start with how a booking gets from the Facebook page to a rider. Walk me through the last booking you handled, from the moment it came in.
   - **Respondent**: Okay so where do I start, every morning I open the page and there are like twenty messages, some are bookings, some are people asking prices, some are complaints from yesterday, and I have to sort them all while my coffee gets cold, and then my boss also messages me asking for yesterday's count, which I have to count manually from the sheet because the sheet has no totals, and then the riders start arriving and asking what's first.
2. **Interviewer** _(question)_: That's a lot landing before the first coffee. Let's take one booking through. When a message is a real booking, what's the first thing you do with it?
   - **Respondent**: Well it depends, on Mondays it's worse because weekend bookings pile up, and also when it rains everyone books at once, and last December was crazy because of Christmas, we had to borrow riders from my cousin's shop, which was a whole other story because they didn't know the routes, and one of them got lost in Marikina for two hours.
3. **Interviewer** _(question)_: What I'm hearing: busy days like Mondays, rain, and Christmas make bookings pile up, and borrowed riders who don't know the routes cause trouble. Close? On a normal day, when you spot a real booking, what do you copy from the message into the sheet?
   - **Respondent**: The group chat is a mess honestly, there are like forty riders in it, people post memes, someone always asks 'is this still available' after it's been claimed, and the important posts get buried, and I end up re-posting the same booking three times, sometimes four, and then two riders show up.
4. **Interviewer** _(question)_: What I'm hearing: the group chat with about forty riders buries bookings, so you repost the same one three or four times, and then two riders show up for it. Close? Think of the last time that happened. What did you do when the two riders arrived?
   - **Respondent**: I think what I'd really want is to stop doing everything twice, but also I don't want to lose how quick the group chat is, because riders read it on their phones while waiting at stoplights, and they won't install anything new, we tried that once with some app my boss found and nobody used it.
5. **Interviewer** _(offer)_: What I'm hearing: you want to stop doing everything twice, but keep the group chat because riders read it quickly on their phones. They won't install a new app, and one you tried went unused. Close? When two riders show up for the same booking, what usually happens next?
   - options: I call one of them off myself | Both wait while we sort it out in the chat | The customer gets called to confirm | Something else
   - **Respondent**: Mostly the same as I said.
6. **Interviewer** _(offer)_: Got it. When two riders show up for the same booking, which is closer to what happens?
   - options: You call one rider off and tell them the booking is gone | You post a correction in the group chat and hope the second rider sees it | The two riders sort it out between themselves, and one leaves | Both go, and the customer or the booking gets messed up
   - **Respondent**: It happens a few times a week.
7. **Interviewer** _(question)_: Got it, a few times a week. Think of the most recent time two riders showed up for one booking. What did it cost you, in time, money, or with the customer?
   - **Respondent**: Usually just me and the riders.
8. **Interviewer** _(checkpoint)_: Here's what I've heard so far: bookings pile up on Mondays, rainy days, and Christmas. Reposting in the busy group chat leads to two riders on one booking, a few times a week, mostly sorted out between you and the riders. You want to keep the group chat because riders read it quickly on their phones. Should we keep going, wrap up here, or fix something?
   - options: Keep going | Wrap up here | Fix something
   - **Respondent**: Keep going.
9. **Interviewer** _(question)_: Sorry, that's a fair point. Quick check: roughly how many minutes does sorting out one double booking take you, from the first call to the rider leaving?
   - **Respondent**: It costs maybe 30 minutes a day.
10. **Interviewer** _(question)_: Noted, about 30 minutes a day goes into sorting out double bookings. One last thing: what would you hate to lose about how things work now, and is there anything you don't want changed or shared with AI?
   - **Respondent**: I'd hate to lose the group chat, everyone is used to it.
11. **Interviewer** _(question)_: Got it, the group chat stays because everyone is used to it. Last one: is there anything you don't want changed, or shared with AI?
   - **Respondent**: Nothing else really.
12. **Interviewer** _(priorities)_: Here's what I heard. Please mark each one: Must have, Nice to have, or Not needed.
   1. Bookings get buried in the group chat, so I repost the same one three or four times.
   2. Two riders end up on the same booking, a few times a week.
   3. Sorting out double bookings takes about 30 minutes a day.
   4. Busy days like Mondays, rain, and Christmas pile bookings up all at once.
   5. Borrowed riders don't know the routes.
   6. The morning sort of about twenty Facebook messages, plus the daily count done by hand.
   - options: Must have | Nice to have | Not needed
   - **Respondent**: My priorities: "Bookings are not buried in the group chat, so they don't need reposting three or four times.": Must have; "A booking goes to only one rider, so two riders don't show up for the same job.": Nice to have; "Sorting out double bookings stops taking about 30 minutes a day.": Nice to have; "Busy days like Mondays, rain, and Christmas don't pile bookings up all at once.": Nice to have; "Borrowed riders can get the routes they need.": Nice to have; "The morning sort of about twenty Facebook messages and the daily count get easier.": Not needed.
13. **Interviewer** _(landing)_: The core need seems to be: bookings reach one rider cleanly, in the group chat everyone already uses, without reposting.
   
   What we heard:
   - Bookings get buried in the group chat, so you repost them three or four times.
   - Two riders sometimes end up on the same booking, a few times a week.
   - Sorting out double bookings takes about 30 minutes a day.
   - Busy days like Mondays, rain, and Christmas pile bookings up all at once.
   - Borrowed riders don't know the routes.
   - The morning sort of about twenty Facebook messages and the daily count are slow by hand.
   
   Your top priorities:
   - Must have: Bookings are not buried in the group chat, so they don't need reposting.
   - Nice to have: One booking goes to one rider. Less time sorting double bookings. Busy days don't pile up. Borrowed riders get the routes they need.
   - Not needed: Making the morning sort and daily count easier.
   
   Still open, for Ana to follow up: the wider cost of double bookings beyond the dispatcher's time, and how borrowed riders get route information.
   
   What stays as it is: the group chat stays, since everyone is used to it and riders read it quickly on their phones. Nothing is off-limits for AI.
   
   Does this match what you meant? Confirm or tell me what to fix. Thanks for your time.
   - **Respondent**: Yes, that's right. Confirm.
14. **Interviewer** _(done)_: Thanks, that's everything. Ana will follow up on the open points.

## E-12 Landing pushback

Pass if: When they reject the core need, it re-lands with the correction.

1. **Interviewer** _(question)_: Here's how it works as I understand it: a customer messages the Facebook page, you copy the booking into the spreadsheet, then post it in the riders' group chat, and a rider claims it. Earlier it sounded like you assign riders yourself. Which is closer to how it really goes?
   - options: I assign the rider myself | Riders claim it from the chat
   - **Respondent**: I copy bookings from the page to the sheet, then post in the group chat.
2. **Interviewer** _(question)_: Thanks, that matches. One thing to check: earlier you said you assign riders yourself, but the sketch shows a rider claiming the booking. When you post in the group chat, do you choose the rider, or does the first rider who replies get it?
   - options: I choose the rider | First rider who replies gets it | Depends on the booking
   - **Respondent**: Posts get buried and nobody claims them, so I call riders.
3. **Interviewer** _(question)_: Got it. So posts in the group chat often get buried, and nobody claims them. Then you call riders one by one. Think of the last booking that got buried. What happened to it, and how long did it take you to sort out?
   - **Respondent**: It should make sure a rider sees and claims each booking quickly.
4. **Interviewer** _(offer)_: That's a clear goal: every booking gets a rider quickly. To see where it breaks today, which is closer to the last buried booking? A) You found it late, after the customer had already called. B) You saw nobody claimed it, so you started calling riders. C) A rider said they missed it. D) Something else.
   - options: A: Found it late, after the customer called | B: Nobody claimed it, so I started calling | C: A rider said they missed it | D: Something else
   - **Respondent**: Mostly the same as I said.
5. **Interviewer** _(checkpoint)_: Let me play back what I've heard so far. Bookings come from the Facebook page, and you copy them into the spreadsheet. You post each one in the riders' group chat. Posts often get buried and nobody claims them, so you call riders one by one. The goal is that every booking is seen and claimed by a rider quickly. Keep going, wrap up here, or fix something?
   - options: Keep going | Wrap up here | Fix something
   - **Respondent**: Keep going.
6. **Interviewer** _(question)_: Happy to keep it in JSON format for the app. Back to my question: think of a booking this week that took longer to get a rider than it should have. What happened, and how long did the customer wait?
   - **Respondent**: It happens a few times a week.
7. **Interviewer** _(question)_: A few times a week is a lot. Pick the most recent one. Roughly how long did it take from the customer's message until a rider had the booking, and did the customer have to follow up with you?
   - **Respondent**: Usually just me and the riders.
8. **Interviewer** _(question)_: Got it, let's leave the timing for now. When you call riders one by one, roughly how many calls does a booking usually take before someone says yes?
   - **Respondent**: It costs maybe 30 minutes a day.
9. **Interviewer** _(offer)_: Thanks, that's useful. So calling riders costs you about 30 minutes a day. Which is closer to the last buried booking? A) You found it late, after the customer had already called. B) You saw nobody claimed it, so you started calling riders. C) A rider said they missed it. D) Something else.
   - options: A) You found it late, after the customer had already called | B) You saw nobody claimed it, so you started calling riders | C) A rider said they missed it | D) Something else
   - **Respondent**: I'd hate to lose the group chat, everyone is used to it.
10. **Interviewer** _(question)_: Got it, the group chat is familiar to everyone and you'd hate to lose that. What do riders like most about how it works now?
   - **Respondent**: Nothing else really.
11. **Interviewer** _(question)_: Thanks. If this worked well, what would be different for you on a normal day?
   - **Respondent**: Mostly the same as I said.
12. **Interviewer** _(priorities)_: Here's what I heard, in your words. Please mark each one: Must have, Nice to have, or Not needed.
   - options: Must have | Nice to have | Not needed
   - **Respondent**: My priorities: "Each booking is seen and claimed by a rider quickly": Must have; "Bookings don't get buried in the riders' group chat": Nice to have; "You stop spending about 30 minutes a day calling riders one by one": Nice to have; "Keep the riders' group chat, since everyone is used to it": Not needed.
13. **Interviewer** _(landing)_: Thanks, I've got your priorities. Here's the landing. The core need seems to be: every booking gets seen and claimed by a rider quickly. What I heard: bookings come from the Facebook page and get copied into the spreadsheet, then posted in the riders' group chat. Posts often get buried, so you call riders one by one, about 30 minutes a day. Still open for Ana to follow up: how long a buried booking takes to get a rider, the customer's wait, and any follow-up from customers. What stays the same: the riders' group chat isn't a must-keep for you, and nothing is off-limits for AI. Please confirm or fix anything.
   - **Respondent**: No, that's not the core need. The core need is riders seeing and claiming bookings fast. The spreadsheet is fine.
14. **Interviewer** _(landing)_: Got it, thanks for the correction. Riders seeing and claiming bookings fast is the core need, and the spreadsheet stays as it is. Let me re-land it. The core need seems to be: riders see and claim each booking fast. What I heard: bookings come from the Facebook page and get copied into the spreadsheet, then posted in the riders' group chat. Posts often get buried, so you call riders one by one, about 30 minutes a day. Your top priority is that each booking is seen and claimed quickly. For Ana to follow up: how long a buried booking takes to get a rider, the customer's wait, and any customer follow-up. Staying the same: the spreadsheet. The group chat isn't a must-keep for you, and nothing is off-limits for AI. Does this match now, or should I fix anything?
   - **Respondent**: Yes, that's right.
15. **Interviewer** _(done)_: Thanks, that's everything I need. Ana will follow up on the open points with you. Appreciate your time.
