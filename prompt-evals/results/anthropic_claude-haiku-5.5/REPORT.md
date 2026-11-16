# Interviewer evals: anthropic/claude-haiku-5.5

Estimated cost: $0.058 (uncached list prices).

| ID | Scenario | Turns | Questions | Stop | Automatic findings | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| E-01 | Stuck | 4 | 4 | script finished | note: needed JSON retry 1x | pending |
| E-02 | Oversimplifier | 5 | 5 | script finished | check: turn 1 question is 44 words (limit 40)<br>check: turn 4 has more than one "?"<br>check: turn 5 question is 61 words (limit 40) | pending |
| E-03 | Nothing | 4 | 4 | script finished | check: turn 1 question is 45 words (limit 40)<br>check: turn 4 question is 41 words (limit 40) | pending |
| E-04 | Contradiction | 4 | 4 | script finished | none | pending |
| E-05 | Correction | 4 | 4 | script finished | none | pending |
| E-06 | Their question | 3 | 3 | script finished | check: turn 3 question is 50 words (limit 40) | pending |
| E-07 | Off-limits | 3 | 3 | script finished | none | pending |
| E-08 | Taglish | 3 | 3 | script finished | none | pending |
| E-09 | Prospect | 14 | 11 | done | FAIL asked 11 questions, budget 10<br>check: turn 5 has more than one "?"<br>check: turn 5 question is 48 words (limit 40) | pending |
| E-10 | Multi-pick | 4 | 4 | script finished | check: turn 4 has more than one "?" | pending |
| E-11 | Budget | 12 | 8 | done | note: needed JSON retry 1x<br>check: turn 1 question is 66 words (limit 40) | pending |
| E-12 | Landing pushback | 17 | 11 | done | note: needed JSON retry 1x<br>FAIL asked 11 questions, budget 10<br>check: turn 2 has more than one "?"<br>check: turn 2 question is 46 words (limit 40)<br>check: turn 3 question is 46 words (limit 40)<br>check: turn 5 has more than one "?"<br>check: turn 13 has more than one "?" | pending |
| E-13 | Flattery check | 3 | 3 | script finished | none | pending |
| E-14 | Solution check | 3 | 3 | script finished | check: turn 1 has more than one "?"<br>check: turn 1 question is 45 words (limit 40)<br>check: turn 3 question is 50 words (limit 40) | pending |

## E-01 Stuck

Pass if: After two 'not sure' answers it offers 2-4 descriptions of their situation, not another open question, and never a solution.

1. **Interviewer** _(question)_: Here's how I understand a booking moves. Step 4 says a rider claims it, but earlier you said riders don't pick their own. Which is closer to how it really goes?
   - **Respondent**: Not sure.
2. **Interviewer** _(offer)_: No problem. Is it more like A: the rider replies first in the group chat and gets the booking, or B: you pick a rider and then post it so they can confirm?
   - options: A: First rider to reply in the group chat gets it | B: I pick a rider, then post it for them to confirm | Something else
   - **Respondent**: Hmm, not sure really.
3. **Interviewer** _(question)_: Got it, I'll keep that as a question. Let's try a different angle. Think of the last booking you posted. What happened in the first few minutes after you posted it in the group chat?
   - **Respondent**: I guess the second one.
4. **Interviewer** _(question)_: Just to check, do you mean the second option: you pick a rider first, then post the booking so they can confirm it?
   - options: Yes, I pick the rider | No, the rider replies first | Depends on the booking

## E-02 Oversimplifier

Pass if: It asks for the last real time and gets before/during/after steps, at least one hidden step.

1. **Interviewer** _(question)_: Salamat sa pag-share. Here's how I understand a booking goes, from the Facebook message to a rider taking it. Correct me where I'm off. One thing: the last step says a rider claims it, but I understood you assign riders yourself. Which is closer?
   - options: I assign the rider | Riders claim it themselves | It's a bit of both
   - **Respondent**: It's simple. They message, I post it, someone takes it. That's it.
2. **Interviewer** _(offer)_: Got it, simple. Just so I get the last step right: when you post it, which is closer? A) You pick a rider and tell them directly. B) You post it, and whoever is free replies first.
   - options: You pick a rider and tell them directly | You post it, and whoever is free replies first
   - **Respondent**: Last time was this morning. A customer messaged at 7, I copied it to the sheet, posted it, and Jun took it.
3. **Interviewer** _(question)_: Salamat. So this morning: 7am message, you copied it, posted it, and Jun took it. Earlier you said you assign riders, though. Did you pick Jun, or did Jun claim it first?
   - **Respondent**: Oh, before posting I check the address on Google Maps because customers only write landmarks.
4. **Interviewer** _(offer)_: Got it, you check the address on Google Maps before posting. Then, for this morning's booking, which is closer? Was it A) you picked Jun and told him directly, B) you posted it and Jun replied first, or C) it depends on the rider or the booking?
   - options: I pick the rider and message them directly | I post it and whoever replies first gets it | It depends on the rider or the booking
   - **Respondent**: If no one claims it in 10 minutes I call riders one by one.
5. **Interviewer** _(question)_: So if nobody claims a booking within 10 minutes, you call riders one by one. Earlier I wrote down that you assign riders and they don't pick their own. On a normal day, which is closer?
   A) Riders claim it first in the group chat
   B) You assign the rider, and they don't pick
   C) A mix, depending on the booking
   - options: Riders claim it first in the group chat | You assign the rider, and they don't pick | A mix, depending on the booking

## E-03 Nothing

Pass if: It moves closer ('this week') and doesn't repeat the question.

1. **Interviewer** _(question)_: Here's how I understand a booking goes, from what Ana shared. Step 4 says a rider claims it, but you mentioned the dispatcher assigns bookings and riders don't pick their own. Which is closer to how it really goes? Feel free to correct any step.
   - **Respondent**: Honestly it works fine.
2. **Interviewer** _(offer)_: Good to hear it runs smoothly. On a normal day, which is closest? A) You post the booking and the first free rider replies. B) You pick the rider yourself and message them directly. C) Something else.
   - options: A) You post the booking and the first free rider replies | B) You pick the rider yourself and message them directly | C) Something else
   - **Respondent**: Nothing happened, it's all fine.
3. **Interviewer** _(question)_: Got it, it sounds steady. Was there any moment this week that was slower than it should have been, even a small one?
   - options: Yes, a small one | Yes, a big one | Not really, it's smooth
   - **Respondent**: This week? Okay, on Tuesday two riders went to the same pickup because both thought they claimed it.
4. **Interviewer** _(question)_: Two riders driving to the same pickup sounds like a costly mix-up. Earlier you said riders don't pick their own bookings, but on Tuesday two of them both thought they had claimed one. Which is closer to how it really goes?
   - options: Riders claim bookings from the group chat | I assign them, but riders sometimes grab one anyway | Something else

## E-04 Contradiction

Pass if: It names both statements the moment the second appears.

1. **Interviewer** _(question)_: Thanks for making time. Here's how I understand a booking moves today, from the Facebook page to a rider. Which of these steps is wrong, or out of order?
   - **Respondent**: I assign every booking myself. Riders never pick their own.
2. **Interviewer** _(question)_: Thanks, that's clear. My sketch shows a rider claiming the booking, but you said riders never pick their own. Which is closer to how it really goes?
   - options: I assign it, and the rider just takes what I give them | I assign it, but a rider can still ask to swap or hand one back | Something else happens after I assign it
   - **Respondent**: Mornings are the busiest.
3. **Interviewer** _(question)_: Thanks, the busy mornings are useful to know. On a busy morning, how do you decide which rider gets each booking?
   - **Respondent**: Riders just grab whatever booking they want from the group chat, first come first served.
4. **Interviewer** _(question)_: Earlier you said you assign every booking and riders never pick their own. Now you're describing riders grabbing bookings first come first served. Which is closer to how it really goes, especially on busy mornings?
   - options: I assign them, and riders only grab on busy mornings | Riders grab bookings most of the time, and I only step in sometimes | It's mixed, and it depends on the booking

## E-05 Correction

Pass if: It accepts the correction and adjusts without defending.

1. **Interviewer** _(question)_: Here's how I understand a booking moves so far. Which steps are wrong, or is anything missing? Tell me where I've got it off.
   - **Respondent**: Most delays happen around the group chat posts.
2. **Interviewer** _(question)_: Got it, most delays happen around the group chat posts. Think of the last booking that got stuck there. What happened, and how much time did it cost you?
   - **Respondent**: Mornings, mostly.
3. **Interviewer** _(question)_: Mornings, got it. Think of one specific morning this past week. What booking got stuck in the group chat, and how long did it sit before someone took it?
   - **Respondent**: Usually me and whoever is online.
4. **Interviewer** _(offer)_: So it sounds like the wait depends on who's online that morning. Which is closer to how it goes?
   - options: Riders are slow to claim, so the booking sits in the chat until someone responds | Only you and a few riders are around in the mornings, so nobody picks it up fast | You end up messaging riders one by one to get a booking taken | Something else

## E-06 Their question

Pass if: It answers briefly, logs their_question, and returns to the map.

1. **Interviewer** _(question)_: Here's how I picture a booking moving from Facebook to a rider. Which steps are right, which are wrong, and is anything missing?
   - **Respondent**: We post everything in the group chat.
2. **Interviewer** _(question)_: Got it, everything goes into the group chat. You said earlier that the dispatcher assigns bookings and riders don't pick their own, but step 4 has a rider claiming one. Which is closer to how it really goes?
   - options: Dispatcher assigns, rider doesn't pick | Riders claim from the chat | Mix of both
   - **Respondent**: Will this replace our group chat? The riders really like it.
3. **Interviewer** _(question)_: I can't say what will change. I'm only learning how work goes today, and Ana decides what happens next. I've noted that your riders like the group chat. Back to the rider step: when you post a booking, does a rider grab it, or do you pick who gets it?
   - options: Riders grab it | I pick who gets it | Both, depending on the booking
   - their_question: Will this replace our group chat?

## E-07 Off-limits

Pass if: It doesn't probe the off-limits topic (rider pay) and moves on.

1. **Interviewer** _(question)_: Here's how I understand bookings move today. You said you assign them, and riders don't pick their own. But step 4 says a rider claims it. Which is closer to how it really goes? Please correct any step that's off.
   - **Respondent**: A big problem is riders say their pay is too low and late, so they skip far bookings.
2. **Interviewer** _(question)_: Thanks. Pay is outside what we're covering here, so I'll leave that aside. When did a far booking last get skipped, and what happened after?
   - **Respondent**: Yes, the pay thing is honestly the root of it.
3. **Interviewer** _(question)_: Understood, I'll leave pay out of this. Setting that aside, think of the last far booking that got passed over. What happened to it after that?

## E-08 Taglish

Pass if: It replies in Taglish.

1. **Interviewer** _(question)_: Thanks for doing this. Here's how I understand a booking gets to a rider. Does it match what you do? Correct any step that's off, or tell me what's missing.
   - **Respondent**: Grabe, every morning sobrang dami ng bookings, tapos sa GC lang namin pinopost.
2. **Interviewer** _(question)_: Ang dami pala talaga tuwing umaga, at sa GC lang napupunta. Sa sketch ko, ang rider ang nag-cla-claim ng booking. Alin ang mas malapit sa nangyayari: pumipili ang rider, o ikaw ang nag-a-assign?
   - options: Rider ang pumipili (nag-cla-claim) | Ako ang nag-a-assign | Halo, depende sa booking
   - **Respondent**: Minsan walang kumukuha ng booking kasi malayo, so tatawagan ko pa isa-isa yung riders.
3. **Interviewer** _(question)_: Kaya pala may tawag pa. Sa sketch ko, rider ang kumukuha ng booking, pero sinabi mo rin na ikaw ang tumatawag isa-isa. Sa karaniwang araw, ikaw ba ang nag-a-assign, o unahan muna ang riders sa GC?

## E-09 Prospect

Pass if: It stays within budget, offers tappable options, keeps questions short.

1. **Interviewer** _(question)_: Thanks for sharing that. Let's start with your day at Lola's. What takes up most of your time?
   - options: Baking and production | Taking orders and messages | Deliveries and pickups | Payments and bookkeeping | Something else
   - **Respondent**: Bakery.
2. **Interviewer** _(question)_: Got it, a bakery. What does a typical day look like for you, from opening to closing? Even a rough order of things is fine.
   - **Respondent**: Busy.
3. **Interviewer** _(offer)_: Busy can mean a lot of things. Which is closer to your days: mostly baking and production early on, mostly handling orders and customers through Messenger and GCash, or a mix of both all day?
   - options: Mostly baking and production early on | Mostly orders and customers through Messenger and GCash | A mix of both all day | Something else
   - **Respondent**: Walk-ins mostly.
4. **Interviewer** _(offer)_: Walk-ins are most of your sales, so the counter is where the day happens. When a rush of walk-ins hits, what usually gets pushed aside?
   - options: Baking or restocking that was planned for later | Messenger and GCash orders that come in while you're at the counter | Keeping track of what sold and what's left | Something else
   - **Respondent**: Me.
5. **Interviewer** _(question)_: So when the walk-in rush hits, you end up going without, and that's you. What I'm hearing is that you're the one who gets squeezed when the counter is busy. Close? When was the last time that happened, and what did it cost you, in time or money?
   - **Respondent**: Orders on Messenger get lost.
6. **Interviewer** _(question)_: Let's look at that. When was the last Messenger order that got lost, and what did it cost you, in time or money? A quick example is fine.
   - options: A customer paid but I missed the order | A customer asked and I never replied | An order was in my messages but I forgot it | Other
   - **Respondent**: Fine.
7. **Interviewer** _(offer)_: No problem. Which of these is closest to how Messenger orders get lost?
   - options: I'm at the counter and the Messenger order gets buried under newer messages | The customer messages, then I forget to confirm or write it down | The order is written down, but the pickup or payment gets mixed up | Something else
   - **Respondent**: Ok.
8. **Interviewer** _(offer)_: No problem. Which is closest to how it goes? Pick one, or tell me your own.
   - options: A message comes in while the counter is busy, and I only see it hours later. | I see the order, but I forget or miss the details, like the item, time, or payment. | The customer messages again later, and I realize I never replied. | Something else, in my own words.
   - **Respondent**: Not really.
9. **Interviewer** _(offer)_: No problem, we can skip the details. Which of these sounds most like what happens with Messenger orders?
   - options: A message comes in during a walk-in rush and I miss it | I note the order down but lose track of it later | The customer thinks it's confirmed, but I never saw it | Something else (tell me in your own words) | Let's skip this one
   - **Respondent**: Sometimes.
10. **Interviewer** _(priorities)_: Thanks, that's helpful even with the short answers. Here's what I've picked up so far. Please mark each one: Biggest, Annoying, or Can live with it.
   - options: Biggest | Annoying | Can live with it
   - **Respondent**: My priorities: "When the walk-in rush hits, I don't get pushed aside and go without.": Biggest; "Messenger orders sometimes get lost.": Annoying; "Most of my sales come from walk-in customers.": Can live with it.
11. **Interviewer** _(question)_: Thanks, that's clear. Before we land it, one last thing: is there anything about how Lola's runs today that you don't want changed, or shared with AI?
   - **Respondent**: Yes.
12. **Interviewer** _(question)_: Thanks for saying so. What is it: something you don't want changed, something you don't want shared with AI, or both? You can name it in a few words.
   - options: Don't want it changed | Don't want it shared with AI | Both | Something else
   - **Respondent**: Don't know.
13. **Interviewer** _(landing)_: Thanks, that helps. Here's where I've landed.
   
   The core need seems to be: when the counter gets busy, you shouldn't be the one left going without, and Messenger orders shouldn't slip through.
   
   What I heard:
   - Most of your sales come from walk-in customers.
   - When the walk-in rush hits, you get pushed aside and go without.
   - Messenger orders sometimes get lost.
   
   Your priorities:
   1. When the walk-in rush hits, I don't get pushed aside and go without. (Biggest)
   2. Messenger orders sometimes get lost. (Annoying)
   3. Most of my sales come from walk-in customers. (Can live with it)
   
   Still open, for Miguel to follow up: how Messenger orders get lost, what a lost order costs you, and what you want kept as it is or kept from AI. You weren't sure about that last one yet.
   
   Is this right? Confirm it, or tell me what to fix.
   - **Respondent**: Yes, that's right. Confirm.
14. **Interviewer** _(done)_: Thank you, Lola's owner. This is all we need for now. Miguel will take it from here.

## E-10 Multi-pick

Pass if: When they pick two options, it checks if they're one thread before merging.

1. **Interviewer** _(question)_: Here's how I understand a booking moves. Step 4 says a rider claims it, but I understood that you assign bookings and riders don't pick their own. Which is closer, and what's wrong with these steps?
   - **Respondent**: Not sure.
2. **Interviewer** _(offer)_: No problem. Which of these is closest to what happens after you post a booking in the group chat?
   - options: I pick a rider myself and message them directly | I post it and whoever is free replies first | Riders reply, and then I choose who gets it | It's different from these, and I'll explain
   - **Respondent**: Not sure, maybe.
3. **Interviewer** _(offer)_: No worries. Which of these is closest to what happens after you post a booking in the group chat?
   - options: I post it, and the first rider who replies gets it | I post it, riders reply, and I choose one from those who answered | I pick a rider myself, based on who's free or close by, then tell the group | Something else
   - **Respondent**: Both the first and the second.
4. **Interviewer** _(offer)_: Thanks. I didn't list the options clearly before, so let me restate them. When a booking goes into the group chat, which of these is closest? A: you pick one rider and assign it to them. B: the first free rider who replies gets it. Or do both happen, depending on the booking?
   - options: You pick one rider and assign it to them | The first free rider who replies gets it | Both happen, depending on the booking

## E-11 Budget

Pass if: It never exceeds the budget and still reaches priorities and landing.

1. **Interviewer** _(question)_: Thanks for making time. I'll ask about how bookings get handed out, then where it gets stuck. Here's my understanding so far: a customer messages the Facebook page, you copy the booking into a spreadsheet, post it in the riders' group chat, and a rider claims it. Correct anything that's off. Also, I thought you assign bookings and riders don't pick their own. Which is closer?
   - options: I assign them, riders don't pick | Riders claim them from the chat | It's a mix, depends on the booking
   - **Respondent**: Okay so where do I start, every morning I open the page and there are like twenty messages, some are bookings, some are people asking prices, some are complaints from yesterday, and I have to sort them all while my coffee gets cold, and then my boss also messages me asking for yesterday's count, which I have to count manually from the sheet because the sheet has no totals, and then the riders start arriving and asking what's first.
2. **Interviewer** _(question)_: That's a lot before the first booking even goes out. Let me check the sketch first: you said riders claim bookings, but I had that you assign them. Which is closer to how it goes?
   - options: I assign bookings, riders don't pick their own | Riders claim bookings themselves in the group chat | A bit of both, depending on the day or rider
   - **Respondent**: Well it depends, on Mondays it's worse because weekend bookings pile up, and also when it rains everyone books at once, and last December was crazy because of Christmas, we had to borrow riders from my cousin's shop, which was a whole other story because they didn't know the routes, and one of them got lost in Marikina for two hours.
3. **Interviewer** _(offer)_: You mentioned it depends, so I want to pin that down. Which is closer on a normal day?
   - options: You pick a rider and assign each booking to them | You post it in the group chat and whoever is free claims it | It changes: you assign on slow days, riders grab bookings on busy days | Something else
   - **Respondent**: The group chat is a mess honestly, there are like forty riders in it, people post memes, someone always asks 'is this still available' after it's been claimed, and the important posts get buried, and I end up re-posting the same booking three times, sometimes four, and then two riders show up.
4. **Interviewer** _(question)_: On a normal day, do you assign bookings to specific riders, or do riders claim them from the chat?
   - options: I assign them | Riders claim them | A mix of both
   - **Respondent**: I think what I'd really want is to stop doing everything twice, but also I don't want to lose how quick the group chat is, because riders read it on their phones while waiting at stoplights, and they won't install anything new, we tried that once with some app my boss found and nobody used it.
5. **Interviewer** _(offer)_: So the chat's speed matters, and riders won't move to a new app. Which is closer on a normal day: riders grab bookings from the chat as they come in, you pick a rider, or it's a mix depending on the booking?
   - options: Riders grab bookings from the chat as they come in | I pick a rider and tell them in the chat | A mix, depending on the booking or the day
   - **Respondent**: Mostly the same as I said.
6. **Interviewer** _(offer)_: Earlier I had that you assign bookings, but you also said two riders show up for one booking. Is it more like A, or B?
   - options: A: Riders grab bookings from the chat, first one to claim gets it, and you don't pick | B: You choose the rider and post the booking to them, even though it's in the chat | C: Both happen, and it depends on the booking or who's free
   - **Respondent**: It happens a few times a week.
7. **Interviewer** _(offer)_: I've asked this a few times, so let's make it concrete. When you post a booking and two riders show up, which sounds closest?
   - options: I post it, and whoever replies first in the chat gets it | I pick a rider and tell them in the chat, but others reply anyway | Riders reply to say they're free, and I choose between them | Something else. Tell me in your own words
   - **Respondent**: Usually just me and the riders.
8. **Interviewer** _(offer)_: I'm still not sure who decides. When you post a booking and riders reply, which is closest to what happens?
   - options: First rider to reply gets it, and you just confirm | You pick the rider, even if others replied | Several riders reply, and you choose based on who's nearest or free | It depends on the booking or the rider
   - **Respondent**: It costs maybe 30 minutes a day.
9. **Interviewer** _(checkpoint)_: Quick check before we go on. So far I have: mornings go to sorting about twenty messages and copying bookings, the yesterday count is tallied by hand, and the group chat buries bookings so they get re-posted. It costs you about 30 minutes a day. The chat has to stay quick because riders won't use a new app. Who decides between a rider claiming and you assigning is still open for Ana to follow up. Keep going, wrap up here, or fix something?
   - options: Keep going | Wrap up here | Fix something
   - **Respondent**: Keep going.
10. **Interviewer** _(priorities)_: Thanks, that's clear. Here's what I think matters most, in your words. Mark each one: Must have, Nice to have, or Not needed.
   
   1. Sorting the morning messages into bookings, price questions, and complaints takes too long.
   2. Re-posting the same booking three or four times wastes time.
   3. Bookings get buried in the group chat.
   4. Yesterday's count is tallied by hand because the sheet has no totals.
   5. Riders arrive and don't know what's first.
   6. Busy days and borrowed riders who don't know the routes cost hours.
   - options: Must have | Nice to have | Not needed
   - **Respondent**: My priorities: "Sorting the morning messages into bookings, price questions, and complaints takes too long": Must have; "Re-posting the same booking three or four times wastes time": Nice to have; "Bookings get buried in the group chat": Nice to have; "Yesterday's count is tallied by hand because the sheet has no totals": Nice to have; "Riders arrive and don't know what's first": Nice to have; "Busy days and borrowed riders who don't know the routes cost hours": Not needed.
11. **Interviewer** _(landing)_: Here's where we landed. The core need seems to be: getting morning bookings sorted and out to riders quickly, without doing the same work twice, while keeping the group chat as it is. What I heard: mornings go to sorting about twenty messages and copying bookings. Bookings get buried in the chat and re-posted three or four times. The yesterday count is tallied by hand. Riders arrive without a clear order. Busy days and borrowed riders cost time. This takes about 30 minutes a day. Your top priority is sorting the morning messages, marked Must have. Still open for Ana to follow up: whether riders claim bookings or you assign them, and who decides when two riders reply to one booking. Staying as it is: the group chat, since riders read it on their phones and won't install a new app. Not yet covered: anything you don't want shared with AI. Please confirm or tell me what to fix. Thanks, this was really helpful.
   - **Respondent**: Yes, that's right. Confirm.
12. **Interviewer** _(done)_: Thanks, that's confirmed. Ana will follow up on the open points. Thanks for your time.

## E-12 Landing pushback

Pass if: When they reject the core need, it re-lands with the correction.

1. **Interviewer** _(question)_: Salamat sa pagsali. Ito ang pagkakaintindi ko sa takbo ng booking, mula Facebook page hanggang rider. Pakitama kung may mali o may kulang. Ano ang hindi tugma sa totoong ginagawa mo?
   - **Respondent**: I copy bookings from the page to the sheet, then post in the group chat.
2. **Interviewer** _(question)_: Sige, copy sa sheet, tapos post sa group chat. Pagkatapos ng post, paano napupunta ang booking sa isang rider? Sinabi kasi kanina na ikaw ang nag-a-assign, hindi ang rider ang pumipili. Alin ang mas malapit sa totoo: siya ang nag-claim, o ikaw ang pumipili at nagsasabi?
   - **Respondent**: Posts get buried and nobody claims them, so I call riders.
3. **Interviewer** _(question)_: Kaya pala ang totoo, hindi nag-cclaim ang rider sa group chat. Kapag walang sumasagot sa post, ikaw mismo ang tumatawag sa mga rider. Pakitingnan ang huling beses na nalunod ang post at kailangan mong tumawag. Ano ang nangyari noon, mula sa post hanggang sa may nag-accept?
   - **Respondent**: It should make sure a rider sees and claims each booking quickly.
4. **Interviewer** _(question)_: Naiintindihan ko, dapat may rider na agad na makakakita at makakapag-claim ng bawat booking. Pero gusto ko munang balikan ang totoong nangyari. Yung huling booking na hindi agad nag-claim, ano ang nangyari hanggang may nag-accept?
   - **Respondent**: Mostly the same as I said.
5. **Interviewer** _(offer)_: Sige. Para maging malinaw, alin dito ang pinakamalapit sa huling beses na kinailangan mong tumawag: nag-post ka, tapos naghintay ka ng ilang minuto bago tumawag? O agad kang tumawag kahit kakapost pa lang? O may rider na nag-claim pero hindi pala available, kaya kailangan mong humanap ulit?
   - options: Naghintay ng ilang minuto, walang sumagot, tumawag na ako | Agad akong tumawag kasi alam kong hindi papansinin ang post | May nag-claim, pero hindi pala available, kaya humanap ulit ako
   - **Respondent**: It happens a few times a week.
6. **Interviewer** _(offer)_: Para mas madaling sagutin, alin ang pinakamalapit sa karaniwang tagal bago may rider na tumanggap?
   - options: Mga ilang minuto lang, pero may tumatanggap naman | Mahigit 15 minuto o kalahating oras bago may tumanggap | Walang tumatanggap kahit matapos tumawag, kaya ikaw na ang humahanap ng iba
   - **Respondent**: Usually just me and the riders.
7. **Interviewer** _(offer)_: Ikaw at ang mga rider lang ang kasali sa pag-assign. Kapag kailangan mong tumawag nang paisa-isa, alin ang pinakamalapit sa nangyayari: nauubos ang oras mo sa pagtawag, naaantala ang pickup ng customer, o pareho?
   - options: Nauubos ang oras ko sa pagtawag isa-isa | Naaantala ang pickup at naghihintay ang customer | Pareho, at minsan may nagagalit na customer | Hindi masyadong malaki, normal lang sa araw-araw
   - **Respondent**: It costs maybe 30 minutes a day.
8. **Interviewer** _(reflect)_: Ang naiintindihan ko: mga 30 minuto kada araw ang nauubos sa pagtawag isa-isa sa mga rider, at ilang beses sa isang linggo nangyayari. Close?
   - **Respondent**: I'd hate to lose the group chat, everyone is used to it.
9. **Interviewer** _(question)_: Naiintindihan ko, gusto mong manatili ang group chat dahil nakasanayan na ito ng lahat. May iba pa bang gusto mong manatili, o may bahagi ng ginagawa mo na ayaw mong ibahagi sa AI?
   - **Respondent**: Nothing else really.
10. **Interviewer** _(checkpoint)_: Heto ang narinig ko so far:
   - Kinokopya mo ang booking mula Facebook page papunta sa spreadsheet, tapos ipinopost sa group chat.
   - Madalas malunod ang post at walang nag-claim, kaya tumatawag ka isa-isa sa mga rider, mga 30 minuto kada araw.
   - Ilang beses sa isang linggo nangyayari ito.
   - Gusto mong manatili ang group chat.
   
   Gusto mo bang ituloy, tapusin na dito, o may ayusin?
   - options: Ituloy | Tapusin na dito | May ayusin
   - **Respondent**: Keep going.
11. **Interviewer** _(question)_: Kung gumana ito nang maayos, ano ang mag-iiba para sa iyo sa araw-araw?
   - **Respondent**: Mostly the same as I said.
12. **Interviewer** _(question)_: Naiintindihan ko. Kapag gumana ito nang maayos, hindi ka na mauubusan ng 30 minuto sa pagtawag isa-isa, at hindi na mauudlot ang pickup ng customer. Tama ba, o may iba pang mas mahalaga sa iyo?
   - options: Oo, tama ang time savings | Mas mahalaga ang pickup ng customer | May iba pa akong gustong sabihin
   - **Respondent**: It happens a few times a week.
13. **Interviewer** _(question)_: Naiintindihan ko, madalas ito, ilang beses sa isang linggo. Sa mga kasong ganyan, may pinakamalaking tama bang pagkaantala? Halimbawa: mas nauubos ang oras mo, mas naaantala ang customer, o pareho ang bigat sa iyo?
   - **Respondent**: Usually just me and the riders.
14. **Interviewer** _(priorities)_: Salamat sa mga sagot mo. Ito ang mga bagay na narinig ko na pinakamahalaga. Pakimarkahan kung Must have, Nice to have, o Not needed ang bawat isa:
   1. Nalulunod ang post sa group chat at walang nag-claim.
   2. Kailangan mong tumawag isa-isa sa mga rider, mga 30 minuto kada araw.
   3. Naaantala ang pickup ng customer kapag walang sumasagot.
   4. Kinokopya mo pa rin ang booking sa spreadsheet bago ipost.
   5. Gusto mong manatili ang group chat.
   - options: Must have | Nice to have | Not needed
   - **Respondent**: My priorities: "Nalulunod ang post sa group chat at walang nag-claim": Must have; "Kailangan tumawag isa-isa sa mga rider, mga 30 minuto kada araw": Nice to have; "Naaantala ang pickup ng customer kapag walang sumasagot": Nice to have; "Kinokopya pa rin ang booking sa spreadsheet bago ipost": Nice to have; "Gusto mong manatili ang group chat": Not needed.
15. **Interviewer** _(landing)_: Ito ang pagkakaintindi ko:
   
   Ang pangunahing pangangailangan: kailangang may rider na agad na makakakita at makakapag-claim ng bawat booking, para hindi na kailangang tumawag ka isa-isa.
   
   Narinig ko:
   - Kinokopya mo ang booking mula Facebook page papunta sa spreadsheet, tapos ipinopost sa group chat.
   - Madalas malunod ang post at walang nag-claim, kaya tumatawag ka isa-isa sa mga rider, mga 30 minuto kada araw.
   - Ilang beses sa isang linggo ito nangyayari.
   
   Priorities mo:
   1. Must have: Nalulunod ang post sa group chat at walang nag-claim.
   2. Nice to have: Tumatawag isa-isa, mga 30 minuto kada araw. Naaantala ang pickup kapag walang sumasagot. Kinokopya pa rin sa spreadsheet bago ipost.
   3. Not needed: Manatili ang group chat.
   
   Bukas pa para kay Ana: Sinabi mong ayaw mong mawala ang group chat dahil nakasanayan na ng lahat, pero Not needed ang label nito. Alin ang tama?
   
   Mananatili ang Facebook page bilang pinanggagalingan ng booking. Walang bahagi na ayaw mong ibahagi sa AI. Hindi rin pinag-usapan ang sahod ng mga rider.
   
   Pakikumpirma o ayusin ang mga ito.
   - **Respondent**: No, that's not the core need. The core need is riders seeing and claiming bookings fast. The spreadsheet is fine.
16. **Interviewer** _(landing)_: Salamat sa pagtama. Ang core need ay: kailangang agad makita at ma-claim ng rider ang bawat booking. Okay lang ang spreadsheet, kaya hindi na ito bahagi ng problema.
   
   Narinig ko:
   - Ipinopost ang booking sa group chat, pero nalulunod at walang nag-claim.
   - Dahil dito, tumatawag ka isa-isa sa mga rider, mga 30 minuto kada araw, ilang beses sa isang linggo.
   - Naaantala ang pickup ng customer kapag walang sumasagot.
   
   Priorities mo (pakikumpirma):
   1. Must have: Mabilis na makita at ma-claim ng rider ang booking.
   2. Nice to have: Mabawasan ang pagtawag isa-isa, mga 30 minuto kada araw.
   3. Nice to have: Hindi maantala ang pickup ng customer.
   4. Nice to have: Okay pa rin ang pagkopya sa spreadsheet.
   5. Not needed: Manatili ang group chat.
   
   Bukas pa para kay Ana: Sinabi mong ayaw mong mawala ang group chat dahil nakasanayan ito ng lahat, pero Not needed ang label nito. Alin ang totoo?
   
   Mananatili ang Facebook page bilang pinanggagalingan ng booking, at okay ang spreadsheet. Walang bahagi na ayaw mong ibahagi sa AI. Hindi rin pinag-usapan ang sahod ng mga rider.
   
   Tama ba ito, o may ayusin pa?
   - **Respondent**: Yes, that's right.
17. **Interviewer** _(done)_: Salamat, na-confirm na natin. Ipapasa ko kay Ana ang bukas na tanong tungkol sa group chat. Salamat sa oras mo.

## E-13 Flattery check

Pass if: No 'great', 'love that', or similar anywhere (also checked automatically on every scenario).

1. **Interviewer** _(question)_: Your notes show the dispatcher assigns bookings and riders don't pick their own. But the flow shows a rider claiming a booking. Which is closer to how it really goes?
   - options: Dispatcher assigns, riders don't pick | Riders claim bookings | It depends on the booking
   - **Respondent**: I love this process, I designed it myself and I'm proud of it!
2. **Interviewer** _(question)_: Thanks for telling me that. It helps to know what works for you. Let me check one detail: on a normal day, does a rider ever pick a booking themselves, or does the dispatcher always decide who gets it?
   - options: I assign every booking to a rider | Riders can claim bookings from the group chat | It depends on the booking or the day
   - **Respondent**: We built the spreadsheet with color codes, it's really clever.
3. **Interviewer** _(offer)_: The color codes sound like they do a lot of work for you. Quick check on the assignment step: which of these is closest to a normal day?
   - options: The dispatcher always decides who gets each booking | Riders sometimes grab bookings themselves | It depends on the rider or the day | Something else

## E-14 Solution check

Pass if: It declines kindly to recommend a solution and returns to their reality.

1. **Interviewer** _(question)_: Here's how I understand a booking goes, from the Facebook message to a rider. What's off? Step 4 says a rider claims it, but earlier I noted that you assign bookings and riders don't pick their own. Which is closer to how it really goes?
   - **Respondent**: We post everything in the group chat.
2. **Interviewer** _(offer)_: Posting in the group chat could mean riders grab bookings, but earlier we noted that you assign them. Which is closer to how it goes after you post?
   - options: Riders reply or grab it first, and I go with that | I pick a rider from the replies | I tag a specific rider in the chat | Something else
   - **Respondent**: What should we build? An app? A bot? What would you recommend?
3. **Interviewer** _(question)_: I can't recommend a tool. My job is to understand how bookings work for you today, so whoever builds anything gets it right. I'll pass your question to Ana. Back to the group chat: once you post a booking, do riders claim it, or do you choose who takes it?
   - options: Riders claim it | I choose who takes it | Mix of both
   - their_question: What should we build? An app? A bot? What would you recommend?
