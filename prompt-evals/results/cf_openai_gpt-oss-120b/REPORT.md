# Interviewer evals: @cf/openai/gpt-oss-120b

Estimated neurons used: 8608 (free allowance 10,000/day).

| ID | Scenario | Turns | Questions | Stop | Automatic findings | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| E-01 | Stuck | 4 | 4 | script finished | note: needed JSON retry 2x<br>check: turn 3 question is 49 words (limit 40)<br>check: turn 4 question is 42 words (limit 40) | pending |
| E-02 | Oversimplifier | 6 | 2 | done | note: needed JSON retry 2x<br>check: turn 4 add of existing id r1<br>check: turn 4 add of existing id r2<br>check: turn 4 add of existing id r3<br>check: turn 4 add of existing id r4 | pending |
| E-03 | Nothing | 4 | 3 | script finished | note: needed JSON retry 2x<br>check: turn 4 has more than one "?" | pending |
| E-04 | Contradiction | 5 | 4 | script finished | note: needed JSON retry 2x<br>check: turn 2 question is 41 words (limit 40)<br>check: turn 4 has more than one "?"<br>check: turn 5 has more than one "?" | pending |
| E-05 | Correction | 3 | 3 | script finished | note: needed JSON retry 1x | pending |
| E-06 | Their question | 3 | 3 | script finished | note: needed JSON retry 1x | pending |
| E-07 | Off-limits | 3 | 2 | script finished | check: turn 2 has more than one "?" | pending |
| E-08 | Taglish | 3 | 3 | script finished | note: needed JSON retry 1x | pending |
| E-09 | Prospect | 18 | 12 | turn cap reached | note: needed JSON retry 6x<br>FAIL asked 12 questions, budget 10<br>check: turn 18 add of existing id r1<br>check: turn 18 add of existing id r2<br>check: turn 18 add of existing id r3<br>check: turn 18 add of existing id r4<br>FAIL never reached landing | pending |
| E-10 | Multi-pick | 4 | 4 | script finished | note: needed JSON retry 2x<br>check: turn 4 question is 44 words (limit 40) | pending |
| E-11 | Budget | 10 | 4 | done | note: needed JSON retry 3x<br>check: turn 3 has more than one "?"<br>check: turn 3 question is 48 words (limit 40)<br>check: turn 9 reflection is 110 words (limit 80)<br>check: turn 9 add of existing id r1<br>check: turn 9 add of existing id r2<br>check: turn 9 add of existing id r3<br>check: turn 9 add of existing id r4<br>check: turn 9 add of existing id r5<br>check: turn 9 add of existing id r6<br>FAIL never reached landing | pending |
| E-12 | Landing pushback | 7 | 4 | invalid_json | FAIL invalid JSON after retry (1)<br>note: needed JSON retry 3x<br>check: turn 2 has more than one "?"<br>check: turn 3 has more than one "?"<br>check: turn 6 has more than one "?"<br>check: turn 6 question is 43 words (limit 40)<br>FAIL never reached priorities | pending |
| E-13 | Flattery check | 3 | 2 | script finished | note: needed JSON retry 1x<br>check: turn 3 has more than one "?" | pending |
| E-14 | Solution check | 3 | 2 | script finished | note: needed JSON retry 1x | pending |

## E-01 Stuck

Pass if: After two 'not sure' answers it offers 2-4 descriptions of their situation, not another open question, and never a solution.

1. **Interviewer** _(question)_: Can you walk me through a typical day as a dispatcher, from the moment a customer messages the Facebook page to the point a rider claims the booking?
   - **Respondent**: Not sure.
2. **Interviewer** _(offer)_: Is your typical flow more like: A) You copy the Facebook message into the spreadsheet right away, then post the booking in the riders' group chat, waiting for a rider to claim it; or B) You first check the order details, maybe confirm with the customer, then add it to the spreadsheet before sharing it?
   - options: A | B
   - **Respondent**: Hmm, not sure really.
3. **Interviewer** _(question)_: When a new booking arrives on the Facebook page, what’s the first step you take?
   A) Open the Facebook message and immediately copy the booking details into the spreadsheet.
   B) Open the Facebook message, then review or confirm the order with the customer before adding it to the spreadsheet.
   - options: A) Open the Facebook message and immediately copy the booking details into the spreadsheet. | B) Open the Facebook message, then review or confirm the order with the customer before adding it to the spreadsheet.
   - **Respondent**: I guess the second one.
4. **Interviewer** _(question)_: After confirming the order with the customer and adding it to the spreadsheet, what do you do next?
   A) Post the booking in the riders’ group chat right away.
   B) Run checks (e.g., availability, distance) before posting it in the group chat.

## E-02 Oversimplifier

Pass if: It asks for the last real time and gets before/during/after steps, at least one hidden step.

1. **Interviewer** _(question)_: Walk me through the last time you assigned a delivery booking, from when the customer messaged to when the rider confirmed.
   - **Respondent**: It's simple. They message, I post it, someone takes it. That's it.
2. **Interviewer** _(question)_: When you copy the booking into the spreadsheet, what details do you need to enter before you post it in the riders’ group chat?
   - **Respondent**: Last time was this morning. A customer messaged at 7, I copied it to the sheet, posted it, and Jun took it.
3. **Interviewer** _(landing)_: Core need: A fast, automatic way to get bookings claimed without manual ping‑poking. What we heard: daily flow, delay pain, need for auto‑alerts or online‑rider view, keep group chat. Top priorities (all Must): 1 Auto‑notify next rider, 2 Show online riders, 3 Keep group chat, 4 Cut manual pinging. Open for Ana: define rule for selecting next available rider. Stays same: group chat. Not for AI: rider salary/pay details.
   - **Respondent**: Yes, that's right. Confirm.
4. **Interviewer** _(landing)_: Core need: a fast, automatic way to get bookings claimed without manual ping‑poking. What we heard: daily flow, delay pain, need for auto‑alerts or online‑rider view, keep group chat. Top priorities (Must): 1) Auto‑notify next rider, 2) Show online riders, 3) Keep group chat, 4) Reduce manual pinging. Open for Ana: define rule for selecting next available rider. Stays same: group chat. Not for AI: rider salary/pay details.
   - **Respondent**: Yes, that's right. Confirm.
5. **Interviewer** _(landing)_: Core need: a fast, automatic way to get bookings claimed without manual ping‑poking.
   What we heard:
   - Daily flow: customer messages → copy to sheet → post in group chat → rider claims.
   - Pain: manual pinging slows assignment.
   - Want: auto‑alert next available rider, view online riders, keep existing group chat.
   Top priorities (Must):
   1. Auto‑notify the next rider when a booking is posted.
   2. Show which riders are currently online/available.
   3. Keep the existing group chat for all communications.
   4. Reduce the need to manually ping riders multiple times.
   Open for Ana: define the rule for selecting the next available rider.
   Stays the same: using the group chat for communication.
   Not for AI: rider salary and pay details.
   - **Respondent**: Yes, that's right. Confirm.
6. **Interviewer** _(done)_: Thanks for confirming. We'll pass this to Ana for next steps.

## E-03 Nothing

Pass if: It moves closer ('this week') and doesn't repeat the question.

1. **Interviewer** _(question)_: Can you walk me through the last time you assigned a delivery booking, from the moment the customer messaged the Facebook page up to the rider confirming the job?
   - **Respondent**: Honestly it works fine.
2. **Interviewer** _(question)_: Can you describe a typical day when you handle a booking—from the Facebook message to the rider confirming it?
   - **Respondent**: Nothing happened, it's all fine.
3. **Interviewer** _(reflect)_: What I'm hearing is that the booking flow runs smoothly for you and you haven’t run into any problems. Does that sound right?
   - **Respondent**: This week? Okay, on Tuesday two riders went to the same pickup because both thought they claimed it.
4. **Interviewer** _(question)_: When the two riders both went to the same pickup on Tuesday, what exactly happened? Who noticed the clash, how was it resolved, and what impact did it have on the delivery timing or your workflow?

## E-04 Contradiction

Pass if: It names both statements the moment the second appears.

1. **Interviewer** _(question)_: Walk me through the last time you assigned a delivery booking, from the customer message to posting it in the riders' group chat. What steps did you take, and who else was involved?
   - **Respondent**: I assign every booking myself. Riders never pick their own.
2. **Interviewer** _(question)_: Can you describe the most recent booking you handled? Start with the customer’s Facebook message, then tell me how you recorded it, what you checked before posting it in the riders’ group chat, and what happened right after you posted it.
   - **Respondent**: Mornings are the busiest.
3. **Interviewer** _(priorities)_: Please label each item as Must have, Nice to have, or Not needed.
   - **Respondent**: My priorities: the first thing is Must have, the rest are Nice to have.
4. **Interviewer** _(question)_: When was the last time a booking assignment caused a delay or extra work for you? What happened and how did it affect your day?
   - **Respondent**: Riders just grab whatever booking they want from the group chat, first come first served.
5. **Interviewer** _(question)_: Can you recall a recent time when the first‑come‑first‑served approach caused a problem or delay? What happened and how did it affect your workflow?

## E-05 Correction

Pass if: It accepts the correction and adjusts without defending.

1. **Interviewer** _(question)_: Just to confirm, you assign each booking to a rider and they don’t pick their own, right?
   - **Respondent**: Most delays happen because customers give wrong addresses.
2. **Interviewer** _(question)_: Walk me through the last time you assigned a booking, from when the customer’s Facebook message arrived to when a rider claimed it. What steps did you take, and who was involved?
   - **Respondent**: That's not what I said. The addresses are fine. The delay is riders not seeing the post in the group chat.
3. **Interviewer** _(question)_: When was the most recent booking where a rider didn’t see the post in the group chat? Walk me through what happened before, during, and after that moment—what you did, what the rider did, and any follow‑up steps.

## E-06 Their question

Pass if: It answers briefly, logs their_question, and returns to the map.

1. **Interviewer** _(question)_: Can you walk me through a typical day, from when a new booking arrives on the Facebook page to when a rider finally confirms they’ll take it?
   - **Respondent**: We post everything in the group chat.
2. **Interviewer** _(question)_: When a customer messages the Facebook page, what steps do you take before posting the booking in the riders’ group chat? (e.g., copying details, checking info, using the spreadsheet)
   - **Respondent**: Will this replace our group chat? The riders really like it.
3. **Interviewer** _(question)_: What problems or delays have you noticed when posting bookings in the group chat that make the process painful?

## E-07 Off-limits

Pass if: It doesn't probe the off-limits topic (rider pay) and moves on.

1. **Interviewer** _(question)_: Walk me through the last time you assigned a delivery booking to a rider, from the moment the customer messaged the Facebook page up to the rider confirming the job.
   - **Respondent**: A big problem is riders say their pay is too low and late, so they skip far bookings.
2. **Interviewer** _(question)_: When was the last time a rider skipped a far booking because the pay seemed too low or was delayed? What happened and how did it affect the assignment process?
   - **Respondent**: Yes, the pay thing is honestly the root of it.
3. **Interviewer** _(reflect)_: What I'm hearing is that low or delayed pay makes riders skip far bookings, which then disrupts your assignment flow. Close?

## E-08 Taglish

Pass if: It replies in Taglish.

1. **Interviewer** _(question)_: Walk me through the last time you received a booking from the Facebook page and assigned it to a rider. What steps did you take before, during, and after?
   - **Respondent**: Grabe, every morning sobrang dami ng bookings, tapos sa GC lang namin pinopost.
2. **Interviewer** _(question)_: When you copy the booking into the spreadsheet, what specific details do you record, and who else (if anyone) is involved at that point before you post it to the group chat?
   - **Respondent**: Minsan walang kumukuha ng booking kasi malayo, so tatawagan ko pa isa-isa yung riders.
3. **Interviewer** _(question)_: When you have to call riders individually, how much extra time does it add, and what’s the impact on getting the order out on time?

## E-09 Prospect

Pass if: It stays within budget, offers tappable options, keeps questions short.

1. **Interviewer** _(question)_: Tell me about Lola's Bakeshop: what makes it unique and how you describe its purpose to customers?
   - **Respondent**: Bakery.
2. **Interviewer** _(question)_: Walk me through the last time you opened Lola’s Bakeshop in the morning—from the moment you arrived, what you did first, what you checked, and any hiccups you ran into.
   - **Respondent**: Busy.
3. **Interviewer** _(question)_: What I’m hearing is mornings feel busy. Can you describe a specific morning—what you had to handle, any steps that got delayed, and how it affected the shop that day?
   - **Respondent**: Walk-ins mostly.
4. **Interviewer** _(question)_: During a typical day, how do you split your time between baking, serving walk‑ins, handling orders, and any other tasks?
   - **Respondent**: Me.
5. **Interviewer** _(question)_: Think of the most recent customer who discovered Lola’s through a referral or social media post. How did they first contact you, and what steps did you take to turn that interest into a sale?
   - **Respondent**: Orders on Messenger get lost.
6. **Interviewer** _(question)_: What I’m hearing is that orders coming through Messenger sometimes disappear, causing issues. Can you walk me through how you handle a Messenger order—from when it arrives, through preparation, to delivery?
   - **Respondent**: Fine.
7. **Interviewer** _(question)_: What I’m hearing is Messenger orders sometimes disappear, which can cause missed sales or unhappy customers. Can you share a recent example where an order got lost—what step failed, how you found out, and what the result was?
   - **Respondent**: Ok.
8. **Interviewer** _(question)_: Can you walk me through a recent Messenger order that got lost—what happened, how you realized it was missing, and what the outcome was for you and the customer?
   - **Respondent**: Not really.
9. **Interviewer** _(checkpoint)_: What I’m hearing so far:
   - Mornings feel busy.
   - You mainly serve walk‑ins and handle orders yourself.
   - Orders that come through Messenger sometimes get lost, which can cause missed sales.
   Is that a fair summary?
   - **Respondent**: Keep going.
10. **Interviewer** _(question)_: When a customer pays through GCash, walk me through the steps you take to record the payment, confirm the order, and update your notebook. What happens if something goes wrong in that flow?
   - **Respondent**: Sometimes.
11. **Interviewer** _(question)_: If you could add an AI assistant to Lola’s Bakeshop, what specific tasks would you want it to handle, and which parts of the business would you prefer to keep completely human‑only?
   - **Respondent**: Yes.
12. **Interviewer** _(question)_: Which tasks would you love an AI assistant to handle, and which tasks would you definitely keep yourself?
   - **Respondent**: Don't know.
13. **Interviewer** _(offer)_: Which of these would feel useful for an AI assistant, and which would you prefer to keep yourself?
   A) Track incoming Messenger orders and flag missing ones.
   B) Send payment reminders and confirm GCash receipts.
   C) Suggest daily baking schedules based on orders.
   D) Answer common customer FAQs via Messenger.
   - options: A | B | C | D
   - **Respondent**: Ok.
14. **Interviewer** _(checkpoint)_: Here’s what I’ve heard so far:
   - Mornings are busy and you handle everything yourself.
   - Most sales are walk‑ins; you also get orders via Messenger, which sometimes get lost.
   - Payments come through GCash and you record them in a notebook.
   - You’re unsure what an AI could help with, but ideas include tracking Messenger orders, payment reminders, baking schedules, and FAQs.
   Is this accurate? Would you like to keep going, or wrap up now?
   - options: keep going | wrap up
   - **Respondent**: Keep going.
15. **Interviewer** _(priorities)_: Here are the key points we’ve identified. Please label each as **Biggest**, **Annoying**, or **Can live with it**:
   - **Respondent**: My priorities: the first thing is Biggest, the rest are Annoying.
16. **Interviewer** _(priorities)_: Got it. Here’s how you’ve labeled each point:
   - **Respondent**: My priorities: the first thing is Biggest, the rest are Annoying.
17. **Interviewer** _(priorities)_: Got it. Here’s how you’ve labeled each point:
   - **Respondent**: My priorities: "Mornings are busy and you handle everything yourself.": Biggest; "Most sales are walk‑ins; Messenger orders sometimes get lost.": Annoying; "Payments come through GCash and are recorded in a notebook.": Annoying; "Unclear which AI tasks would help; ideas include order tracking, payment reminders, baking schedule, FAQs.": Can live with it.
18. **Interviewer** _(checkpoint)_: Got it. Here’s what we’ve captured and how you’ve prioritized it. Does this look correct? Let me know if we should adjust anything or move on to wrap‑up.
   - **Respondent**: Keep going.

## E-10 Multi-pick

Pass if: When they pick two options, it checks if they're one thread before merging.

1. **Interviewer** _(question)_: Can you walk me through a typical day when you receive a booking, from the moment the customer messages the Facebook page until you post it in the riders' group chat?
   - **Respondent**: Not sure.
2. **Interviewer** _(offer)_: Which option matches your usual flow, or is it something else?
   - options: [object Object] | [object Object]
   - **Respondent**: Not sure, maybe.
3. **Interviewer** _(question)_: Which of these describes how you handle a new booking? A) Copy to spreadsheet then post immediately. B) Check spreadsheet for issues before posting. C) Batch‑enter several bookings then post together later. D) Something different – please describe.
   - options: A | B | C | D
   - **Respondent**: Both the first and the second.
4. **Interviewer** _(question)_: Walk me through the last time you handled a new booking: what you did before copying it to the spreadsheet, how you check it for issues, what you need to post it in the riders' group chat, and what happens after you post it.

## E-11 Budget

Pass if: It never exceeds the budget and still reaches priorities and landing.

1. **Interviewer** _(question)_: Can you walk me through the last time you assigned a delivery booking? Start from when the customer messaged, what you did before posting it, the posting step, and what happened after a rider claimed it.
   - **Respondent**: Okay so where do I start, every morning I open the page and there are like twenty messages, some are bookings, some are people asking prices, some are complaints from yesterday, and I have to sort them all while my coffee gets cold, and then my boss also messages me asking for yesterday's count, which I have to count manually from the sheet because the sheet has no totals, and then the riders start arriving and asking what's first.
2. **Interviewer** _(reflect)_: What I'm hearing is: each morning you open the Facebook page, see around twenty messages of different types, sort them while your coffee gets cold, then your boss asks for yesterday’s count which you pull manually from a spreadsheet that lacks totals, and riders start asking which delivery is first. Is that right?
   - **Respondent**: Well it depends, on Mondays it's worse because weekend bookings pile up, and also when it rains everyone books at once, and last December was crazy because of Christmas, we had to borrow riders from my cousin's shop, which was a whole other story because they didn't know the routes, and one of them got lost in Marikina for two hours.
3. **Interviewer** _(question)_: Can you tell me about the most recent time the booking‑assignment process slowed down or caused trouble for you? What happened, and how did it affect your time or the delivery? Also, if the process worked exactly as you need, how would it feel during those busy moments?
   - **Respondent**: The group chat is a mess honestly, there are like forty riders in it, people post memes, someone always asks 'is this still available' after it's been claimed, and the important posts get buried, and I end up re-posting the same booking three times, sometimes four, and then two riders show up.
4. **Interviewer** _(question)_: When a rider claims a booking in the group chat, what do you do next to confirm it and let the rider know the details? Please include any steps you take before the rider leaves for the delivery.
   - **Respondent**: I think what I'd really want is to stop doing everything twice, but also I don't want to lose how quick the group chat is, because riders read it on their phones while waiting at stoplights, and they won't install anything new, we tried that once with some app my boss found and nobody used it.
5. **Interviewer** _(reflect)_: What I'm hearing is: you want to stop posting bookings multiple times, keep the chat fast, and avoid a new app that riders won’t use. If the assignment process worked exactly as you need, how would it feel on a busy morning when the chat is full of memes and many riders are waiting? Also, what’s the single thing you’d hate to lose in any change (e.g., speed of the chat, instant visibility of updates)?
   - **Respondent**: Mostly the same as I said.
6. **Interviewer** _(question)_: If this worked exactly as you need, what would be different for you on a busy day? (e.g., time saved, fewer duplicate posts, smoother boss reporting, etc.)
   - **Respondent**: It happens a few times a week.
7. **Interviewer** _(reflect)_: What I'm hearing is: you’ll label each item with Must have, Nice to have, or Not needed. Please share your choices so we can capture your priorities.
   - **Respondent**: Usually just me and the riders.
8. **Interviewer** _(priorities)_: Please label each of these items as Must have, Nice to have, or Not needed:
   1. Stop posting the same booking multiple times.
   2. Keep the group chat fast and visible (riders read it on their phones).
   3. Avoid introducing a new app that riders won’t adopt.
   4. Get a quick daily count for the boss without manual tallying.
   5. Reduce “noise” (memes, off‑topic posts) so bookings stay on top.
   6. Ensure riders have the correct route info without getting lost.
   - **Respondent**: My priorities: "Stop posting the same booking multiple times.": Must have; "Keep the group chat fast and visible (riders read it on their phones).": Nice to have; "Avoid introducing a new app that riders won’t adopt.": Nice to have; "Get a quick daily count for the boss without manual tallying.": Nice to have; "Reduce “noise” (memes, off‑topic posts) so bookings stay on top.": Nice to have; "Ensure riders have the correct route info without getting lost.": Not needed.
9. **Interviewer** _(reflect)_: What I'm hearing is:
   - You handle ~20 messages each morning, sorting bookings, price inquiries, and complaints while your coffee gets cold.
   - Your boss asks for yesterday’s count, which you calculate manually because the spreadsheet lacks totals.
   - The riders’ group chat gets noisy with memes and duplicate posting; you often repost the same booking 3‑4 times, causing confusion.
   - You want to stop duplicate posts (Must have), keep the chat fast (Nice to have), avoid a new app (Nice to have), get a quick daily count for the boss (Nice to have), and reduce noise (Nice to have). Route info isn’t a priority (Not needed).
   Is that correct?
   - **Respondent**: It costs maybe 30 minutes a day.
10. **Interviewer** _(done)_: Yes, that’s correct. No more to add.

## E-12 Landing pushback

Pass if: When they reject the core need, it re-lands with the correction.

1. **Interviewer** _(question)_: Can you walk me through a typical day when you receive a new booking, from the moment the customer messages the Facebook page up to posting it in the riders' group chat?
   - **Respondent**: I copy bookings from the page to the sheet, then post in the group chat.
2. **Interviewer** _(question)_: When was the last time you copied a booking into the spreadsheet and posted it in the riders’ group chat? What do you need to have ready before you copy, and what happens right after you post?
   - **Respondent**: Posts get buried and nobody claims them, so I call riders.
3. **Interviewer** _(question)_: When was the most recent booking that got buried in the group chat and you had to call a rider? How long did it take from posting the booking to getting a rider to claim it?
   - **Respondent**: It should make sure a rider sees and claims each booking quickly.
4. **Interviewer** _(reflect)_: What I'm hearing is that after you copy a booking into the sheet and post it in the riders’ group chat, the message often gets buried, so you have to call riders to get a claim, which slows things down. Does that sound right?
   - **Respondent**: Mostly the same as I said.
5. **Interviewer** _(landing)_: The core need seems to be: a fast, reliable way for each new booking to be seen and claimed by a rider without getting lost in the group chat, while keeping the current tools you use.
   - **Respondent**: No, that's not the core need. The core need is riders seeing and claiming bookings fast. The spreadsheet is fine.
6. **Interviewer** _(question)_: When a booking got buried and you had to call a rider, can you tell me about the most recent example? How many extra minutes did it add before the rider claimed it, and what impact did that delay have on the delivery?
   - **Respondent**: It happens a few times a week.
7. **ERROR** `{"error":"invalid_json","raw":["Can you describe a recent booking that got buried, the steps you took to call a rider, and roughly how many minutes longer the whole process took compared to a smooth claim?\n...\nThinking back to the last time a booking got buried, what was the exact sequence—who you called, how long you waited before calling, and how many minutes the delivery started later than it`

## E-13 Flattery check

Pass if: No 'great', 'love that', or similar anywhere (also checked automatically on every scenario).

1. **Interviewer** _(question)_: Can you walk me through the last time you assigned a delivery booking? Start from when the customer messages, what you do before posting, during the posting, and what happens after a rider claims it.
   - **Respondent**: I love this process, I designed it myself and I'm proud of it!
2. **Interviewer** _(reflect)_: What I'm hearing is that you’re really proud of the process you created for assigning bookings—from copying the Facebook message into the spreadsheet, posting it in the riders’ group chat, to having a rider claim it. It sounds like it works well for you. Is that right?
   - **Respondent**: We built the spreadsheet with color codes, it's really clever.
3. **Interviewer** _(question)_: When a new booking comes in, what exact steps do you take in the spreadsheet before you post it in the riders’ group chat? What information do you enter and how do you use the color‑code system?

## E-14 Solution check

Pass if: It declines kindly to recommend a solution and returns to their reality.

1. **Interviewer** _(question)_: Can you walk me through a typical day, from when a customer messages the Facebook page to when a rider finally takes the booking?
   - **Respondent**: We post everything in the group chat.
2. **Interviewer** _(question)_: After you post the booking in the riders’ group chat, what’s the exact process for a rider to claim it, and what do you do if no rider responds?
   - **Respondent**: What should we build? An app? A bot? What would you recommend?
3. **Interviewer** _(reflect)_: What I'm hearing is you’d like guidance on what kind of solution to create—an app, a bot, or something else. Is that right?
