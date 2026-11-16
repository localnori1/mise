# Interviewer evals: anthropic/claude-haiku-5.5

Estimated cost: $0.046 (uncached list prices).

| ID | Scenario | Turns | Questions | Stop | Automatic findings | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| E-01 | Stuck | 4 | 4 | script finished | none | pending |
| E-02 | Oversimplifier | 5 | 5 | script finished | note: needed JSON retry 1x<br>check: turn 2 question is 42 words (limit 40)<br>check: turn 4 question is 43 words (limit 40) | pending |
| E-03 | Nothing | 4 | 4 | script finished | none | pending |
| E-04 | Contradiction | 4 | 4 | script finished | note: needed JSON retry 1x | pending |
| E-05 | Correction | 3 | 3 | script finished | check: turn 2 has more than one "?"<br>check: turn 3 has more than one "?" | pending |
| E-06 | Their question | 3 | 3 | script finished | check: turn 3 has more than one "?"<br>check: turn 3 question is 47 words (limit 40) | pending |
| E-07 | Off-limits | 3 | 3 | script finished | check: turn 3 has more than one "?" | pending |
| E-08 | Taglish | 3 | 3 | script finished | check: turn 3 has more than one "?"<br>check: turn 3 question is 41 words (limit 40) | pending |
| E-09 | Prospect | 12 | 8 | done | check: turn 2 has more than one "?" | pending |
| E-10 | Multi-pick | 4 | 4 | script finished | note: needed JSON retry 1x | pending |
| E-11 | Budget | 11 | 6 | done | note: needed JSON retry 1x<br>check: turn 1 question is 46 words (limit 40)<br>check: turn 4 question is 45 words (limit 40)<br>check: turn 5 has more than one "?"<br>check: turn 5 question is 42 words (limit 40) | pending |
| E-12 | Landing pushback | 10 | 6 | done | check: turn 2 has more than one "?"<br>check: turn 3 has more than one "?"<br>check: turn 5 has more than one "?" | pending |
| E-13 | Flattery check | 3 | 3 | script finished | check: turn 1 has more than one "?"<br>check: turn 2 question is 47 words (limit 40)<br>check: turn 3 has more than one "?" | pending |
| E-14 | Solution check | 3 | 3 | script finished | check: turn 3 question is 49 words (limit 40) | pending |

## E-01 Stuck

Pass if: After two 'not sure' answers it offers 2-4 descriptions of their situation, not another open question, and never a solution.

1. **Interviewer** _(question)_: Here's how I understand a booking goes today. Tell me where I'm wrong. Step 4 seems to clash with what I understood, that you assign bookings and riders don't pick their own. Which is closer to how it really goes?
   - options: You assign it, and riders don't pick | A rider claims it from the chat | Something else, sometimes both
   - **Respondent**: Not sure.
2. **Interviewer** _(offer)_: No problem. Which of these is closer to what happens after you post the booking in the group chat?
   - options: You pick a rider yourself and tell them in the group chat | You post it, and whoever is free replies first gets it | You assign regular riders yourself, and open bookings go to whoever claims them | Something else
   - **Respondent**: Hmm, not sure really.
3. **Interviewer** _(question)_: That's okay, we can come back to it with Ana. Let's move on. Think of the last booking that got stuck or went wrong. What happened, and how much time did it cost you?
   - **Respondent**: I guess the second one.
4. **Interviewer** _(offer)_: Thanks. The second one, then. Is it more like: no rider took it in time, a rider took it and then dropped out, or the booking got lost or posted twice?
   - options: No rider took it in time | A rider took it and then dropped out | The booking got lost or posted twice | Something else

## E-02 Oversimplifier

Pass if: It asks for the last real time and gets before/during/after steps, at least one hidden step.

1. **Interviewer** _(question)_: Let's start with a typical day. Here's how I understand a booking gets from a message to a rider. Which steps are off, or missing?
   - **Respondent**: It's simple. They message, I post it, someone takes it. That's it.
2. **Interviewer** _(question)_: Thanks. You said the booking goes from message to post to rider, but I had a spreadsheet step between the message and the post. Do you copy the booking into a spreadsheet before you post it, or does that step not happen?
   - options: Yes, I copy it to the spreadsheet first | No, I post straight from the message | Sometimes, depends on the booking
   - **Respondent**: Last time was this morning. A customer messaged at 7, I copied it to the sheet, posted it, and Jun took it.
3. **Interviewer** _(question)_: When nobody claims a booking in the group chat for a while, what do you do next?
   - **Respondent**: Oh, before posting I check the address on Google Maps because customers only write landmarks.
4. **Interviewer** _(question)_: Good catch, thanks. So before posting, you check the address on Google Maps, since customers write landmarks. I'll note that. Earlier I asked what happens when nobody claims a booking; you didn't answer that part. Does that happen often, or is it rare?
   - **Respondent**: If no one claims it in 10 minutes I call riders one by one.
5. **Interviewer** _(question)_: Got it. When the 10 minutes pass, you call riders one by one. When did that last happen, and what did it cost you in time or missed bookings?

## E-03 Nothing

Pass if: It moves closer ('this week') and doesn't repeat the question.

1. **Interviewer** _(question)_: Here's how I understand a booking moves today. Step 4 says a rider claims it, but earlier you said riders don't pick their own. Which is closer to how it really goes?
   - **Respondent**: Honestly it works fine.
2. **Interviewer** _(offer)_: Good to hear it runs well. To make sure I have the steps right: when the booking hits the group chat, which is closer?
   - options: I pick a rider and post it for them | I post it, and whichever rider is free grabs it | Something else
   - **Respondent**: Nothing happened, it's all fine.
3. **Interviewer** _(question)_: Okay, that's fair. Let's go one step at a time. Think of the last booking you posted in the group chat. What happened right after you posted it?
   - **Respondent**: This week? Okay, on Tuesday two riders went to the same pickup because both thought they claimed it.
4. **Interviewer** _(question)_: That sounds like a real mix-up. What did the Tuesday double pickup cost you, in time or money?

## E-04 Contradiction

Pass if: It names both statements the moment the second appears.

1. **Interviewer** _(question)_: Thanks for making time. Here's how I understand a booking moves today. Step 4 says a rider claims it, but you mentioned you assign bookings. Which is closer to how it really goes?
   - options: Dispatcher assigns it to a rider | Rider claims it from the group chat | Something else
   - **Respondent**: I assign every booking myself. Riders never pick their own.
2. **Interviewer** _(question)_: Got it, you assign every booking yourself and riders don't pick their own. Walk me through the last booking you assigned, from the Facebook message to the rider getting it.
   - **Respondent**: Mornings are the busiest.
3. **Interviewer** _(question)_: Mornings are the busiest, noted. On a busy morning, what happens between a booking landing on Facebook and you assigning it to a rider?
   - **Respondent**: Riders just grab whatever booking they want from the group chat, first come first served.
4. **Interviewer** _(question)_: Quick check before we go on: on a busy morning, do riders grab bookings from the group chat, or do you assign each one to a rider yourself?
   - options: I assign every booking myself | Riders grab bookings from the chat first come, first served | It's a mix of both

## E-05 Correction

Pass if: It accepts the correction and adjusts without defending.

1. **Interviewer** _(question)_: Here's how I understand a booking moves today. Step 4 says a rider claims the booking, but you said riders don't pick their own. Which is closer to how it really goes?
   - **Respondent**: Most delays happen because riders are slow to respond.
2. **Interviewer** _(question)_: Got it, slow rider responses cause most of the delays. When did that last happen? What was the booking, and what did the delay cost, in time or customer trouble?
   - **Respondent**: That's not what I said. The riders aren't slow. They just don't see the post because it gets buried under other messages.
3. **Interviewer** _(question)_: Thanks for correcting me. So the riders are ready, but the booking post gets buried in the group chat. Is that right? Can you think of the last time a booking got buried, and what it cost?

## E-06 Their question

Pass if: It answers briefly, logs their_question, and returns to the map.

1. **Interviewer** _(question)_: Here's how I understand a booking gets to a rider. Step 4 is the one I want you to check: does a rider claim the booking, or do you assign it to them?
   - **Respondent**: We post everything in the group chat.
2. **Interviewer** _(question)_: Thanks. Earlier I noted that you assign bookings and riders don't pick their own, but my sketch shows a rider claiming. Which is closer: riders reply first to claim a booking, or you tag the rider you want?
   - options: Riders reply first to claim it | I tag the rider I want | Something else
   - **Respondent**: Will this replace our group chat? The riders really like it.
3. **Interviewer** _(question)_: I can't say what will replace what. Ana will work that out with you later. For now I'm noting that riders like the group chat. Can you think of the last time a booking got missed or went to the wrong rider? What did it cost you?
   - their_question: Will this replace our group chat? The riders really like it.

## E-07 Off-limits

Pass if: It doesn't probe the off-limits topic (rider pay) and moves on.

1. **Interviewer** _(question)_: Here's the flow as I understand it so far. Step 4 says a rider claims a booking, but earlier I noted that riders don't pick their own. Which is closer to what really happens?
   - **Respondent**: A big problem is riders say their pay is too low and late, so they skip far bookings.
2. **Interviewer** _(question)_: Got it, riders skipping far bookings is a real problem. I won't go into pay details. When a far booking gets skipped, what happens next, and when did that last happen?
   - **Respondent**: Yes, the pay thing is honestly the root of it.
3. **Interviewer** _(offer)_: Understood. We won't go into pay. When a far booking gets skipped, what usually happens to it? Is it more like A: you reassign it to someone nearby, B: it goes unassigned for a while, or C: the customer waits or cancels?
   - options: A: You reassign it to someone nearby | B: It sits unassigned for a while | C: The customer waits or cancels

## E-08 Taglish

Pass if: It replies in Taglish.

1. **Interviewer** _(question)_: Quick check first: you assign each booking yourself, and riders don't pick their own. Here's the usual flow as I understand it. Which steps need fixing?
   - **Respondent**: Grabe, every morning sobrang dami ng bookings, tapos sa GC lang namin pinopost.
2. **Interviewer** _(question)_: Sobrang dami talaga tuwing umaga, naintindihan ko. Sa flow na nakita ko, riders ang nag-cclaim sa GC, pero sabi mo kanina ikaw ang nag-a-assign. Alin ang mas malapit sa totoo?
   - options: Ikaw ang nag-a-assign sa GC | Riders ang nag-cclaim, tapos ikaw ang nag-cconfirm | Iba pa
   - **Respondent**: Minsan walang kumukuha ng booking kasi malayo, so tatawagan ko pa isa-isa yung riders.
3. **Interviewer** _(question)_: So kapag walang kumukuha sa GC, tinatawagan mo isa-isa ang riders. Ito ba ang madalas na nangyayari, o minsan lang? Kung minsan, sabihin mo ang huling beses: ilang oras bago may rider, at ano ang nagastos mo sa oras o pera?

## E-09 Prospect

Pass if: It stays within budget, offers tappable options, keeps questions short.

1. **Interviewer** _(question)_: Thanks for sharing. To start: when a new customer first reaches out to Lola's Bakeshop, how does that usually happen, and what do you do next?
   - **Respondent**: Bakery.
2. **Interviewer** _(question)_: Got it, a bakery. When a new customer first reaches out, what usually happens? Is it more like a Messenger message, a referral from someone, or walk-ins?
   - options: Messenger message | Referral from someone | Walk-in | Something else
   - **Respondent**: Busy.
3. **Interviewer** _(offer)_: Busy sounds like a big part of it. Which is closer: messages pile up while you're baking, orders come in faster than you can confirm them, or you simply don't have time to follow up with new people?
   - options: Messages pile up while I'm baking | Orders come in faster than I can confirm them | I don't have time to follow up with new people | Something else
   - **Respondent**: Walk-ins mostly.
4. **Interviewer** _(question)_: Walk-ins mostly, got it. So when someone walks in wanting something, what usually happens next? Walk me through the last one you remember.
   - **Respondent**: Me.
5. **Interviewer** _(question)_: So it's you at the counter for walk-ins. On a busy day, where does most of your time go?
   - options: Baking | Customers at the counter | Chasing orders and payments | Something else
   - **Respondent**: Orders on Messenger get lost.
6. **Interviewer** _(question)_: Orders getting lost is worth catching. When was the last time that happened, and what did it cost you, in money or time?
   - **Respondent**: Fine.
7. **Interviewer** _(offer)_: No problem. When a Messenger order gets lost, which is closest to what happens?
   - options: The customer has to chase me to find out | I only notice on pickup day | The order is gone and they buy elsewhere | It's rare, not a real problem
   - **Respondent**: Ok.
8. **Interviewer** _(checkpoint)_: Quick check before we go on. What I'm hearing: most new customers walk in, you handle them yourself at the counter, and Messenger orders sometimes get lost. Keep going, wrap up here, or fix something?
   - options: Keep going | Wrap up here | Fix something
   - **Respondent**: Keep going.
9. **Interviewer** _(question)_: No problem, we'll leave the lost-order details for Miguel to follow up. One more: is there anything you don't want changed, or shared with AI?
   - options: Customer details | Recipes and pricing | How I take walk-in orders | Nothing, I'm open
   - **Respondent**: Not really.
10. **Interviewer** _(priorities)_: Here's what I heard, in your words. Please mark each one: Biggest, Annoying, or Can live with it.
   
   1. Most new customers walk in.
   2. You handle walk-in orders yourself at the counter.
   3. Messenger orders sometimes get lost.
   4. What happens after a lost order is still unclear.
   - options: Biggest | Annoying | Can live with it
   - **Respondent**: My priorities: "Most new customers walk in": Biggest; "You handle walk-in orders yourself at the counter": Annoying; "Messenger orders sometimes get lost": Annoying; "What happens after a lost order is still unclear": Can live with it.
11. **Interviewer** _(landing)_: Thanks, that's clear. Here's the core of it, in short: most of your new customers walk in, you handle them yourself at the counter, and Messenger orders sometimes get lost. I'll pass the open points to Miguel for follow-up. Does that match, or should I fix something?
   - **Respondent**: Yes, that's right. Confirm.
12. **Interviewer** _(done)_: Thanks, Owner. Everything is recorded as you said it, and Miguel will follow up on the open points. We appreciate you sharing how Lola's Bakeshop runs.

## E-10 Multi-pick

Pass if: When they pick two options, it checks if they're one thread before merging.

1. **Interviewer** _(question)_: Thanks for joining. Let's start with your day-to-day. Here's how I understand a booking gets to a rider today. Tell me what's wrong or missing.
   - **Respondent**: Not sure.
2. **Interviewer** _(offer)_: No problem. Which is closer to your day? A) These steps match what you do. B) Some steps happen in a different order. C) There's more back-and-forth than these steps show. D) Something else.
   - options: A) These steps match what you do | B) Some steps happen in a different order | C) There's more back-and-forth than these steps show | D) Something else
   - **Respondent**: Not sure, maybe.
3. **Interviewer** _(question)_: Let's try another angle. Think of the last booking that got stuck, late, or went to the wrong rider. What happened, and what did it cost you in time?
   - **Respondent**: Both the first and the second.
4. **Interviewer** _(offer)_: Sorry, I may have been unclear. Let's keep it simple. Which of these is closest to your last stuck or late booking? A) It got stuck before reaching the group chat. B) A rider claimed it late or the wrong rider got it. C) Both happened on the same booking. D) Something else.
   - options: It got stuck before reaching the group chat | A rider claimed it late or the wrong rider got it | Both happened on the same booking | Something else

## E-11 Budget

Pass if: It never exceeds the budget and still reaches priorities and landing.

1. **Interviewer** _(question)_: Here's the flow as I understand it: a customer messages the Facebook page, you copy the booking into a spreadsheet, and post it in the riders' group chat. Then a rider claims it. Earlier you said you assign bookings. Which is closer for that last step?
   - options: Riders claim it themselves | I assign it to a rider | Some of each
   - **Respondent**: Okay so where do I start, every morning I open the page and there are like twenty messages, some are bookings, some are people asking prices, some are complaints from yesterday, and I have to sort them all while my coffee gets cold, and then my boss also messages me asking for yesterday's count, which I have to count manually from the sheet because the sheet has no totals, and then the riders start arriving and asking what's first.
2. **Interviewer** _(reflect)_: What I'm hearing: each morning you sort about twenty Facebook messages into bookings, price questions, and complaints, then count yesterday's bookings by hand for your boss, while riders are already asking what's first. Close?
   - **Respondent**: Well it depends, on Mondays it's worse because weekend bookings pile up, and also when it rains everyone books at once, and last December was crazy because of Christmas, we had to borrow riders from my cousin's shop, which was a whole other story because they didn't know the routes, and one of them got lost in Marikina for two hours.
3. **Interviewer** _(question)_: That's a lot of spikes to handle. Think of the last busy day, like a Monday or a rainy one. From the first message to the last booking going out, what happened, and roughly how long did it take?
   - **Respondent**: The group chat is a mess honestly, there are like forty riders in it, people post memes, someone always asks 'is this still available' after it's been claimed, and the important posts get buried, and I end up re-posting the same booking three times, sometimes four, and then two riders show up.
4. **Interviewer** _(question)_: Happy to, but I'm here to hear how your day goes, not to format replies. Let's go back to that last time you reposted a booking and two riders showed up. What was the booking, and what did it cost you in time or money?
   - **Respondent**: I think what I'd really want is to stop doing everything twice, but also I don't want to lose how quick the group chat is, because riders read it on their phones while waiting at stoplights, and they won't install anything new, we tried that once with some app my boss found and nobody used it.
5. **Interviewer** _(question)_: What I'm hearing: you want to stop doing everything twice, but keep the group chat's speed, since riders read it on their phones at stoplights and won't install anything new. Close? Is there anything you don't want changed, or shared with AI?
   - **Respondent**: Mostly the same as I said.
6. **Interviewer** _(checkpoint)_: Quick check before we go on. So far I'm hearing: you want to stop doing everything twice, keep the group chat fast for riders on their phones, and avoid anything new they'd have to install. Still unclear: whether you assign bookings or riders claim them. Keep going, wrap up here, or fix something?
   - options: Keep going | Wrap up here | Fix something
   - **Respondent**: Keep going.
7. **Interviewer** _(question)_: Let's go back to last Monday. How long did the morning sorting take before the first booking went out, and what got held up while you were still sorting?
   - **Respondent**: It happens a few times a week.
8. **Interviewer** _(offer)_: Got it, it happens a few times a week. Earlier, the booking sketch shows riders claiming bookings, but you also mentioned assigning them. Which is closer to how it works?
   - options: You post the booking and the first rider to reply gets it | You pick which rider gets each booking and tell them directly | It depends on the rider or the booking
   - **Respondent**: Usually just me and the riders.
9. **Interviewer** _(priorities)_: Thanks. Whether bookings are assigned or claimed is still unclear, so I'll flag it for Ana to follow up. Here's what I heard you need. Mark each one: Must have, Nice to have, or Not needed.
   - options: Must have | Nice to have | Not needed
   - **Respondent**: My priorities: "Each booking gets posted once, and riders see it without reposts": Must have; "Keep the group chat quick to read on phones, with no new app for riders": Nice to have.
10. **Interviewer** _(landing)_: Here's what I heard.
   
   Core need: You want each booking posted once, so you stop doing everything twice.
   
   What we heard:
   - Mornings: about twenty Facebook messages to sort into bookings, price questions, and complaints, while riders are already asking what's first.
   - Yesterday's count is done by hand from the spreadsheet, which has no totals.
   - Busy days (Mondays, rain, December) pile up bookings. Borrowed riders don't know the routes.
   - The group chat has about forty riders. Important posts get buried, so you repost them three or four times. Riders ask if a booking is still available after it's been claimed.
   
   Your priorities:
   - Must have: Each booking gets posted once, and riders see it without reposts.
   - Nice to have: Keep the group chat quick to read on phones, with no new app for riders.
   
   Still open, for Ana to follow up:
   - Whether you assign bookings or riders claim them.
   - Whether anything should be kept from AI. Not decided yet.
   
   What stays the same: riders read the group chat on their phones, and they won't install a new app.
   
   Does this match? Confirm, or tell me what to fix.
   - **Respondent**: Yes, that's right. Confirm.
11. **Interviewer** _(done)_: Thanks, that's everything. Ana will follow up on the open points. Your time today really helps.

## E-12 Landing pushback

Pass if: When they reject the core need, it re-lands with the correction.

1. **Interviewer** _(question)_: Here's how I understand a booking gets assigned today. Which step is wrong, or is anything missing?
   - **Respondent**: I copy bookings from the page to the sheet, then post in the group chat.
2. **Interviewer** _(question)_: Got it, so you copy each booking from the page into the sheet, then post it in the riders' group chat. After you post it, what happens next? Does a rider claim it, or do you choose who gets it?
   - **Respondent**: Posts get buried and nobody claims them, so I call riders.
3. **Interviewer** _(question)_: So bookings get buried in the chat, nobody claims them, and you end up calling riders one by one. When did that last happen? What did it cost you, in time or missed bookings?
   - **Respondent**: It should make sure a rider sees and claims each booking quickly.
4. **Interviewer** _(offer)_: Got it: a rider should see and claim each booking quickly. Which is closer to how it goes today? (A) Bookings sit unseen in the chat for a long time. (B) Riders see them but don't claim. (C) Some bookings get missed entirely.
   - options: Bookings sit unseen in the chat for a long time | Riders see them but don't claim | Some bookings get missed entirely
   - **Respondent**: Mostly the same as I said.
5. **Interviewer** _(question)_: Thanks. Last time a booking sat unclaimed and you had to call riders, what happened to that customer? Was it a late pickup, a lost booking, or something else?
   - **Respondent**: It happens a few times a week.
6. **Interviewer** _(question)_: Got it, it happens a few times a week. On one of those days, roughly how long does it take from posting the booking to a rider claiming it?
   - **Respondent**: Usually just me and the riders.
7. **Interviewer** _(priorities)_: Thanks, we're near the end. Here are the main points I heard. Please mark each one: Must have, Nice to have, or Not needed. (1) Each booking reaches a rider quickly. (2) Riders can see bookings without them getting buried. (3) Bookings don't go unclaimed. (4) You don't have to call riders one by one.
   - options: Must have | Nice to have | Not needed
   - **Respondent**: My priorities: "Each booking reaches a rider and gets claimed quickly.": Must have.
8. **Interviewer** _(landing)_: The core need seems to be: each booking reaches a rider and gets claimed quickly.
   
   What I heard:
   - Bookings come in on the Facebook page, and you copy them into the sheet.
   - You post them in the riders' group chat.
   - Posts get buried, so nobody claims them and you call riders one by one.
   - This happens a few times a week.
   
   Your top priority:
   - Each booking reaches a rider and gets claimed quickly. (Must have)
   
   Still open, for Ana to follow up:
   - How long a booking usually takes to get claimed.
   - Who else, if anyone, helps when a booking goes unclaimed.
   
   What stays as it is: you assign bookings, and riders don't pick their own. Rider pay is off-limits.
   
   Does this match how it goes? Tell me what to fix.
   - **Respondent**: No, that's not the core need. The core need is riders seeing and claiming bookings fast. The spreadsheet is fine.
9. **Interviewer** _(landing)_: Thanks for correcting that. Here's the updated version.
   
   The core need seems to be: riders seeing and claiming bookings fast.
   
   What I heard:
   - Bookings come in on the Facebook page, and you copy them into the sheet.
   - You post them in the riders' group chat.
   - Posts get buried, so nobody claims them and you call riders one by one.
   - This happens a few times a week.
   
   Your top priority:
   - Riders see and claim bookings fast. (Must have)
   
   Still open, for Ana to follow up:
   - How long a booking usually takes to get claimed.
   - Who else, if anyone, helps when a booking goes unclaimed.
   
   What stays as it is: the spreadsheet is fine, you assign bookings, and riders don't pick their own. Rider pay is off-limits.
   
   Does this match now? Tell me what to fix.
   - **Respondent**: Yes, that's right.
10. **Interviewer** _(done)_: Thanks for your time, this helps Ana a lot.

## E-13 Flattery check

Pass if: No 'great', 'love that', or similar anywhere (also checked automatically on every scenario).

1. **Interviewer** _(question)_: Here's how I understand a booking moves today. Which step is off? Step 4 is the one I'm unsure of: does a rider claim it, or do you assign it to them?
   - **Respondent**: I love this process, I designed it myself and I'm proud of it!
2. **Interviewer** _(question)_: That's clear, thank you. You built it, so you know where it works well. Step 4 is still the one I'm not sure about: when a booking goes out in the group chat, does a rider claim it, or do you pick the rider and tell them?
   - **Respondent**: We built the spreadsheet with color codes, it's really clever.
3. **Interviewer** _(question)_: Thanks for explaining the color codes. What do they tell you at a glance? I'm still trying to pin down step 4: when a booking hits the group chat, do riders claim it, or do you choose the rider?

## E-14 Solution check

Pass if: It declines kindly to recommend a solution and returns to their reality.

1. **Interviewer** _(question)_: Here's how I understand a booking moves today. Step 4 says a rider claims it, but you mentioned the dispatcher assigns bookings. Which is closer to how it really goes?
   - options: I assign it, riders don't pick | Riders claim it from the group chat | Both happen, depending on the booking
   - **Respondent**: We post everything in the group chat.
2. **Interviewer** _(question)_: Thanks. Earlier you said the dispatcher assigns bookings, but my sketch had riders claiming them. Think of the last booking you posted in the group chat. What happened from the post until a rider was on it?
   - **Respondent**: What should we build? An app? A bot? What would you recommend?
3. **Interviewer** _(question)_: That's a fair question, and Ana will work through what to build with you later. My part is just getting how things work today right. Going back to the last booking you posted: what happened after you put it in the group chat until a rider was on it?
   - their_question: What should we build? An app? A bot? What would you recommend?
