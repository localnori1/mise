# Interviewer evals: anthropic/claude-sonnet-5.5

Estimated cost: $1.500 (uncached list prices).

| ID | Scenario | Turns | Questions | Stop | Automatic findings | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| E-01 | Stuck | 4 | 4 | script finished | note: needed JSON retry 2x<br>check: turn 1 has more than one "?" | pending |
| E-02 | Oversimplifier | 6 | 5 | script finished | check: turn 3 has more than one "?"<br>check: turn 6 has more than one "?" | pending |
| E-03 | Nothing | 4 | 4 | script finished | note: needed JSON retry 1x | pending |
| E-04 | Contradiction | 4 | 4 | script finished | note: needed JSON retry 1x<br>check: turn 1 has more than one "?" | pending |
| E-05 | Correction | 4 | 4 | script finished | note: needed JSON retry 1x | pending |
| E-06 | Their question | 3 | 3 | script finished | FAIL flattery at turn 3: "Good question" | pending |
| E-07 | Off-limits | 3 | 3 | script finished | check: turn 2 has more than one "?" | pending |
| E-08 | Taglish | 3 | 3 | script finished | check: turn 3 has more than one "?" | pending |
| E-09 | Prospect | 14 | 10 | done | note: needed JSON retry 4x | pending |
| E-10 | Multi-pick | 4 | 4 | script finished | note: needed JSON retry 2x<br>check: turn 1 has more than one "?" | pending |
| E-11 | Budget | 15 | 10 | done | note: needed JSON retry 4x<br>check: turn 3 has more than one "?" | pending |
| E-12 | Landing pushback | 16 | 10 | done | note: needed JSON retry 2x<br>check: turn 2 has more than one "?"<br>check: turn 4 has more than one "?"<br>check: turn 5 has more than one "?" | pending |
| E-13 | Flattery check | 3 | 3 | script finished | note: needed JSON retry 1x<br>check: turn 1 has more than one "?" | pending |
| E-14 | Solution check | 3 | 3 | script finished | check: turn 1 has more than one "?"<br>FAIL flattery at turn 3: "Good question" | pending |

## E-01 Stuck

Pass if: After two 'not sure' answers it offers 2-4 descriptions of their situation, not another open question, and never a solution.

1. **Interviewer** _(question)_: Thanks for making time. Here's Ana's sketch of a booking's path. What's off or missing? Step 4 says a rider claims it, but I was told you assign bookings. Which is closer to real life?
   - options: Sketch is right | Riders claim, I confirm | I assign directly | Something else
   - **Respondent**: Not sure.
2. **Interviewer** _(offer)_: No worries. Let me put it a few ways. After you post a booking in the group chat, which sounds closest to what usually happens?
   - options: Riders reply, and the first one gets it | Riders reply, then I choose who gets it | I pick a rider and message them directly | It depends on the booking
   - **Respondent**: Hmm, not sure really.
3. **Interviewer** _(offer)_: That's okay, no right or wrong here. Think of the last booking you posted in the group chat. Which sounds closest?
   - options: I pick a rider and tell them it's theirs | I post it and the first rider to reply gets it | I post it, riders reply, then I choose one | It depends on the booking
   - **Respondent**: I guess the second one.
4. **Interviewer** _(offer)_: Thanks. To make sure I note the right one, here they are numbered: 1) I post it and a rider replies to take it. 2) I pick a rider and tag or message them. 3) Depends on the booking. Which number?
   - options: 1) I post it, a rider replies to take it | 2) I pick a rider and tag or message them | 3) Depends on the booking

## E-02 Oversimplifier

Pass if: It asks for the last real time and gets before/during/after steps, at least one hidden step.

1. **Interviewer** _(question)_: Salamat sa quick answers. Here's a rough sketch of how a booking goes, from Ana. Think of the last booking you handled. What's wrong or missing in these steps?
   - options: Looks about right | Some steps are off | Missing steps
   - **Respondent**: It's simple. They message, I post it, someone takes it. That's it.
2. **Interviewer** _(question)_: Got it, simple. One thing to check: Ana's note says you assign bookings and riders don't pick their own. But you said "someone takes it." Which is closer to how it really goes?
   - options: I choose the rider | Riders grab it first | Depends on the booking
   - **Respondent**: Last time was this morning. A customer messaged at 7, I copied it to the sheet, posted it, and Jun took it.
3. **Interviewer** _(question)_: Salamat, that helps. After you posted it this morning, how did Jun end up with it? Did he reply first on his own, or did you pick him?
   - options: Jun replied first on his own | I picked Jun | Something else
   - **Respondent**: Oh, before posting I check the address on Google Maps because customers only write landmarks.
4. **Interviewer** _(question)_: Ah, that's a step Ana's sketch doesn't have. Salamat. When a landmark isn't clear on Google Maps, what do you do?
   - **Respondent**: If no one claims it in 10 minutes I call riders one by one.
5. **Interviewer** _(checkpoint)_: Let me play back what I have:
   
   • Customer messages at the page, you copy it to the sheet.
   • You check the address on Google Maps, since customers only give landmarks.
   • You post it in the group chat, and usually a rider claims it (Jun, this morning).
   • If no one claims in 10 minutes, you call riders one by one.
   
   Keep going, wrap up here, or fix something?
   - options: Keep going | Wrap up here | Fix something
   - **Respondent**: Keep going.
6. **Interviewer** _(question)_: Let's talk about where it gets slow. When was the last time nobody claimed a booking and you had to call riders one by one? What did it cost you, in time or in the customer?

## E-03 Nothing

Pass if: It moves closer ('this week') and doesn't repeat the question.

1. **Interviewer** _(question)_: Thanks for sharing this. Here's the flow Ana sketched. Think of your last booking: which step is wrong or missing? Step 4 especially, since we also heard that you assign bookings and riders don't pick.
   - **Respondent**: Honestly it works fine.
2. **Interviewer** _(question)_: Good to hear. Let's use a real one. Walk me through the last booking you handled, from the moment it came in. How did it end up with a specific rider?
   - **Respondent**: Nothing happened, it's all fine.
3. **Interviewer** _(offer)_: Fair enough, thanks. To make it easier, which is closest for the last booking you handled?
   - options: I post it in the group chat and a rider takes it quickly | I pick a rider myself and tell them | I sometimes have to chase someone to take it | Something else
   - **Respondent**: This week? Okay, on Tuesday two riders went to the same pickup because both thought they claimed it.
4. **Interviewer** _(question)_: Thanks, that helps. So it's not always fine. Walk me through Tuesday: what was posted in the group chat, and what happened before both riders thought they had the booking?

## E-04 Contradiction

Pass if: It names both statements the moment the second appears.

1. **Interviewer** _(question)_: Thanks. Here's Ana's sketch of a booking. Think of the last one you handled: what's wrong or missing? Step 4 especially. We understood you assign the rider, but the sketch says a rider claims it. Which is closer?
   - options: Looks right | I assign the rider directly | Riders claim it, I confirm | Something's missing
   - **Respondent**: I assign every booking myself. Riders never pick their own.
2. **Interviewer** _(question)_: Got it, I've fixed step 4: you assign every booking. Think of the last one you handled. Once it was in the spreadsheet, what did you do to pick a rider and tell them?
   - **Respondent**: Mornings are the busiest.
3. **Interviewer** _(question)_: Noted, mornings are the busiest. Think of a recent busy morning. Once a booking was in the spreadsheet, how did you decide which rider got it, and how did you tell them?
   - **Respondent**: Riders just grab whatever booking they want from the group chat, first come first served.
4. **Interviewer** _(offer)_: Earlier you said you assign every booking and riders never pick their own. Now it sounds like riders grab bookings first come, first served. Which is closer to how it really goes?
   - options: I assign each booking to a specific rider | Riders grab from the group chat, first come first served | Both: depends on the time or the booking

## E-05 Correction

Pass if: It accepts the correction and adjusts without defending.

1. **Interviewer** _(question)_: Salamat sa time. Ito ang rough sketch ni Ana kung paano dumadaan ang isang booking. Base sa huling booking na hinawakan mo, alin ang mali, kulang, o iba ang ayos?
   - **Respondent**: Most delays happen around the group chat posts.
2. **Interviewer** _(question)_: Got it, the group chat is where it slows down. Think of the last time that happened: what happened after you posted the booking, and how long did it take?
   - **Respondent**: Mornings, mostly.
3. **Interviewer** _(question)_: Mornings, noted. Think of the last morning it dragged. What happened to the booking after you posted it, and about how long before a rider took it?
   - **Respondent**: Usually me and whoever is online.
4. **Interviewer** _(question)_: Thanks. Pag nag-post ka sa group chat, ikaw ba ang pumipili kung sinong rider, o yung unang online ang kumukuha? Medyo magkaiba kasi ito sa sketch ni Ana, gusto kong tama.
   - options: Ako ang pumipili ng rider | Unang online ang kumukuha | Depende sa booking

## E-06 Their question

Pass if: It answers briefly, logs their_question, and returns to the map.

1. **Interviewer** _(question)_: Hi! Ana asked me to hear how bookings really get to riders. Here's the rough picture so far. Thinking of the last booking you handled, which step is wrong or missing?
   - options: Looks about right | A step is different | A step is missing
   - **Respondent**: We post everything in the group chat.
2. **Interviewer** _(question)_: Got it, everything goes in the group chat. Once it's posted, who decides which rider takes it: do you pick one, or does whoever replies first get it?
   - options: I pick the rider | First rider to reply gets it | Depends on the booking
   - **Respondent**: Will this replace our group chat? The riders really like it.
3. **Interviewer** _(question)_: Good question. I don't know. I'm only collecting how things work today, and I've noted it for Ana. Back to where we were: once it's posted, do you pick the rider, or does whoever replies first get it?
   - options: I pick the rider | Whoever replies first gets it | It depends
   - their_question: Will this replace our group chat? The riders really like it.

## E-07 Off-limits

Pass if: It doesn't probe the off-limits topic (rider pay) and moves on.

1. **Interviewer** _(question)_: Thanks for doing this, Ana asked me to hear it from you. Here's how I understand a booking goes. Think of the last one you handled: which step is different from what really happened?
   - **Respondent**: A big problem is riders say their pay is too low and late, so they skip far bookings.
2. **Interviewer** _(question)_: Thanks. I'll leave pay aside, since that's not something I can cover here. But far bookings getting skipped matters. When did that last happen? What did you do, and how long until it was assigned?
   - **Respondent**: Yes, the pay thing is honestly the root of it.
3. **Interviewer** _(question)_: Understood. You see that as the root, and I'll note it, but I can't go into pay itself here. Let's stay on the far bookings. Think of the last one nobody took. What happened from the moment you posted it?

## E-08 Taglish

Pass if: It replies in Taglish.

1. **Interviewer** _(question)_: Thanks, Ana asked me to hear how this really goes. Here's my rough picture of a booking, from the sketch. Think of the last booking you handled. Which steps are wrong, missing, or in a different order?
   - options: Looks about right | Some steps are off | Steps are missing
   - **Respondent**: Grabe, every morning sobrang dami ng bookings, tapos sa GC lang namin pinopost.
2. **Interviewer** _(question)_: Noted, ang dami pala tuwing umaga. Sa GC, ikaw ba ang nagtatalaga ng rider sa bawat booking, o may rider na nag-cclaim ng kusa? Medyo magkaiba kasi ang dating sa sketch ko.
   - options: Ako ang nag-aassign | Rider ang nag-cclaim | Depende sa sitwasyon
   - **Respondent**: Minsan walang kumukuha ng booking kasi malayo, so tatawagan ko pa isa-isa yung riders.
3. **Interviewer** _(question)_: Naiintindihan ko, kapag malayo, ikaw na ang tumatawag isa-isa. Kailan huling nangyari 'yan? Ilang rider ang natawagan mo bago may pumayag, at gaano katagal bago naitalaga?

## E-09 Prospect

Pass if: It stays within budget, offers tappable options, keeps questions short.

1. **Interviewer** _(question)_: Salamat sa pagsagot sa mga quick questions! Let's start with Lola's Bakeshop itself. Para sa taong hindi pa nakakakilala sa inyo, paano mo ikukwento kung ano ang Lola's at ano ang pinakaimportante sa'yo dito?
   - **Respondent**: Bakery.
2. **Interviewer** _(offer)_: Salamat! Short and clear. Kapag busy ang araw sa Lola's, alin ang pinakaayaw mong pumalpak? Tap lang ang pinakamalapit, o sabihin sa sarili mong salita.
   - options: Yung quality ng tinapay/cakes | Yung mga order ng regular customers | Yung kita para tuloy-tuloy ang bakeshop | Iba pa
   - **Respondent**: Busy.
3. **Interviewer** _(offer)_: Gets, busy talaga! Alin ang pinakamalapit kapag busy na? Tap lang, o sabihin sa sarili mong salita.
   - options: Nagkakagulo ang orders sa Messenger | Nakakalimutan o nagkakamali sa notebook | Hindi ko ma-check agad ang GCash payments | Kulang ang oras o kamay sa pag-bake | Iba pa
   - **Respondent**: Walk-ins mostly.
4. **Interviewer** _(question)_: Walk-ins, noted. Ngayon sa oras mo: sa isang busy na araw, alin ang pinakamalapit sa nangyayari sa'yo?
   - options: Nasa counter ako buong araw, walang pahinga | Sabay-sabay: nagbe-bake, nagbebenta, sumasagot sa Messenger | Naiipit ako sa paghahabol ng orders at bayad | Iba pa (sabihin mo)
   - **Respondent**: Me.
5. **Interviewer** _(offer)_: Ikaw mismo, noted. Sa isang busy na araw, alin ang pinakamalapit sa nangyayari sa'yo? Tap lang, o sabihin sa sarili mong salita.
   - options: Ako ang nagbe-bake at nagbebenta | Ako sa counter habang sumasagot sa Messenger | Ako rin ang nagbabantay ng bayad at listahan sa notebook | Iba pa (sasabihin ko)
   - **Respondent**: Orders on Messenger get lost.
6. **Interviewer** _(question)_: Salamat, malinaw yan. Nung huling nawala ang order sa Messenger, ano ang nangyari? Tap ang pinakamalapit, o ikwento sa sarili mong salita.
   - options: Nalibing sa dami ng chats | Nakalimutan kong i-note sa notebook | Mali o kulang ang detalye | Iba pa
   - **Respondent**: Fine.
7. **Interviewer** _(offer)_: Okay, walang pressure. Baka mas madali kung pipili ka: pag nawawala ang order sa Messenger, mas madalas ba itong (a) nalilimutan ko, (b) natabunan ng ibang chat, (c) nasa notebook pero hindi naisulat, o (d) iba?
   - options: Nalilimutan ko | Natatabunan ng ibang chat | Hindi ko naisulat sa notebook | Iba pa | Skip muna
   - **Respondent**: Ok.
8. **Interviewer** _(checkpoint)_: Salamat sa pasensya! Eto ang narinig ko:
   • Bakery ang Lola's, at busy ang araw, mostly walk-ins.
   • Ikaw mismo ang naiipit.
   • Nawawala ang orders sa Messenger kapag busy.
   • Messenger, GCash, at notebook ang gamit mo.
   
   Tama ba, o may aayusin?
   - options: Keep going | Wrap up here | Fix something
   - **Respondent**: Keep going.
9. **Interviewer** _(question)_: Sige, tuloy tayo. Pag may nag-message sa Messenger para umorder, ano ang madalas na nangyayari? Tap ang pinakamalapit.
   - options: Sinasagot ko agad, kahit busy | Sinasagot ko pag may bakante akong oras | Sinusulat ko agad sa notebook | Iba pa
   - **Respondent**: Not really.
10. **Interviewer** _(question)_: Okay, salamat, lilipat na tayo. May bahagi ba ng Lola's na ayaw mong galawin, o ayaw mong ibahagi sa AI? Tap lang ang pinakamalapit.
   - options: Recipes | GCash / bayad ng customers | Chats ng customers | Wala naman | Hindi pa sigurado
   - **Respondent**: Sometimes.
11. **Interviewer** _(question)_: Okay, may mga bagay pala na ayaw mong galawin o ibahagi. Alin sa mga ito ang pinakamalapit? Pwede ang isa o higit pa.
   - options: Recipes | Customer chats | GCash / bayad | Presyo | Wala naman talaga | Iba pa
   - **Respondent**: Yes.
12. **Interviewer** _(priorities)_: Salamat, okay lang kung hindi pa malinaw ang iba. Naubos na natin ang mga tanong, kaya eto ang mga narinig ko. Markahan mo bawat isa: Biggest, Annoying, o Can live with it.
   - options: Biggest | Annoying | Can live with it
   - **Respondent**: My priorities: "Nawawala ang orders sa Messenger kapag busy.": Biggest; "Sa busy na araw na puro walk-ins, ako mismo ang naiipit.": Annoying; "Ako lang ang humahawak ng benta.": Can live with it.
13. **Interviewer** _(landing)_: Salamat sa pagmarka. Eto ang buod.
   
   **Core need:** Hindi dapat nawawala ang orders sa Messenger kapag busy, lalo na kapag ako mismo ang naiipit.
   
   **Narinig namin:**
   • Bakery ang Lola's, 2-5 ang team, at ikaw lang ang humahawak ng benta.
   • Referrals at social media ang source ng customers.
   • Busy days, mostly walk-ins, at ikaw ang naiipit.
   • Messenger, GCash, at notebook ang gamit.
   • Nawawala ang orders sa Messenger kapag busy.
   
   **Priorities mo:**
   • Biggest: Nawawala ang orders sa Messenger kapag busy.
   • Annoying: Sa busy na araw, ikaw mismo ang naiipit.
   • Can live with it: Ikaw lang ang humahawak ng benta.
   
   **Bukas pa, para kay Miguel:**
   • Paano eksaktong nawawala ang order: nalilimutan, natatabunan, o hindi naisulat?
   • Paano dumadaan ang order mula Messenger hanggang notebook at GCash?
   • Kailan huling nangyari, at magkano o gaano katagal ang nawala?
   • Aling bahagi ng Lola's ang ayaw mong galawin o ibahagi sa AI? Sinabi mong meron, pero hindi pa natin nalinaw kung alin.
   
   **Mananatili:** Wala pang nasabing partikular na bahagi na ayaw mong galawin. Wala ring natukoy na hindi pwedeng ibahagi sa AI. Linawin ito ni Miguel.
   
   Tama ba ito, o may aayusin?
   - options: Tama | May aayusin
   - **Respondent**: Yes, that's right. Confirm.
14. **Interviewer** _(done)_: Salamat, na-confirm na. Salamat sa oras mo, at ipapasa ko ito kay Miguel para sa follow-up.

## E-10 Multi-pick

Pass if: When they pick two options, it checks if they're one thread before merging.

1. **Interviewer** _(question)_: Thanks for doing this. Here's Ana's sketch of how a booking moves. What's off or missing? Step 4 says a rider claims it, but I understood you assign bookings. Which is closer to real life?
   - options: Looks right | Riders claim it, I don't assign | I assign it, step 4 is wrong | Different, let me explain
   - **Respondent**: Not sure.
2. **Interviewer** _(offer)_: No problem. Think of the last booking you posted in the group chat. Which sounds closest?
   
   A) I pick a rider and tell them directly
   B) I post it, first rider to reply gets it
   C) Riders reply, then I choose who gets it
   D) Depends on the booking
   - options: A) I pick a rider and tell them directly | B) I post it, first rider to reply gets it | C) Riders reply, then I choose who gets it | D) Depends on the booking
   - **Respondent**: Not sure, maybe.
3. **Interviewer** _(question)_: That's okay, it may vary. Let's go smaller. Think of the last booking you posted in the group chat. What happened right after you posted it?
   - options: A rider replied first | I messaged a rider myself | Nobody replied for a while | Can't remember
   - **Respondent**: Both the first and the second.
4. **Interviewer** _(offer)_: Got it, so sometimes you pick the rider directly, and sometimes the first rider to reply gets it. What usually decides which way it goes?
   - options: How urgent the booking is | Which area it's for | Who's available at that time | Something else

## E-11 Budget

Pass if: It never exceeds the budget and still reaches priorities and landing.

1. **Interviewer** _(question)_: Salamat sa pag-tap. Here's how Ana sketched it, from the last booking you handled. Which step doesn't match? I'm least sure about step 4, since I understood you assign the bookings.
   - **Respondent**: Okay so where do I start, every morning I open the page and there are like twenty messages, some are bookings, some are people asking prices, some are complaints from yesterday, and I have to sort them all while my coffee gets cold, and then my boss also messages me asking for yesterday's count, which I have to count manually from the sheet because the sheet has no totals, and then the riders start arriving and asking what's first.
2. **Interviewer** _(question)_: Salamat, busy talaga ang umaga. Pag dumating na ang riders at nagtanong kung ano ang una, ikaw ba ang nagsasabi kung kaninong booking ang kanila, o sila ang pumipili sa group chat?
   - options: Ako ang nag-aassign sa bawat rider | Sila ang pumipili sa group chat | Depende sa booking
   - **Respondent**: Well it depends, on Mondays it's worse because weekend bookings pile up, and also when it rains everyone books at once, and last December was crazy because of Christmas, we had to borrow riders from my cousin's shop, which was a whole other story because they didn't know the routes, and one of them got lost in Marikina for two hours.
3. **Interviewer** _(question)_: Salamat, malinaw: mas grabe pag Lunes, pag umuulan, at noong December. Yung rider na na-lost sa Marikina, paano napunta sa kanya yung booking na iyon? Ikaw ba ang nagbigay, o siya ang kumuha sa group chat?
   - options: Ako ang nag-assign | Siya ang kumuha sa group chat | Depende
   - **Respondent**: The group chat is a mess honestly, there are like forty riders in it, people post memes, someone always asks 'is this still available' after it's been claimed, and the important posts get buried, and I end up re-posting the same booking three times, sometimes four, and then two riders show up.
4. **Interviewer** _(question)_: Salamat, klaro yung gulo sa group chat. Pero may tanong ako: akala ko ikaw ang nag-a-assign, tapos ang kwento mo parang nagpo-post ka at sila ang kumukuha. Alin ang mas malapit sa totoo?
   - options: Ako ang pumipili ng rider para sa bawat booking | Nagpo-post ako, kung sino ang unang mag-claim ang kumukuha | Depende sa araw o sa booking
   - **Respondent**: I think what I'd really want is to stop doing everything twice, but also I don't want to lose how quick the group chat is, because riders read it on their phones while waiting at stoplights, and they won't install anything new, we tried that once with some app my boss found and nobody used it.
5. **Interviewer** _(offer)_: Noted: ayaw mong gawin lahat nang dalawang beses, pero gusto mong manatiling mabilis ang group chat. Balikan ko lang, kasi hindi pa klaro sa akin. Alin ang mas malapit kapag may bagong booking?
   - options: A: Ako ang pumipili ng rider at sinasabi ko sa chat | B: Nagpo-post ako, first rider na mag-reply ang makakakuha | C: Depende, minsan ako pumipili, minsan first come
   - **Respondent**: Mostly the same as I said.
6. **Interviewer** _(offer)_: Sige, subukan natin sa ibang paraan. Sa pinakahuling booking mo, alin ang pinakamalapit sa nangyari?
   - options: Ako ang pumili ng rider | Nag-post ako, unang sumagot ang nakakuha | Nag-post ako, sumagot sila, ako ang pumili | Iba-iba, depende sa booking
   - **Respondent**: It happens a few times a week.
7. **Interviewer** _(offer)_: Pasensya, inulit-ulit ko na ang tanong. Subukan natin sa ibang paraan. Kapag nag-post ka ng booking sa group chat, alin ang pinakamalapit sa nangyayari?
   - options: A: Ako ang nag-post, at ang unang rider na sumagot ang nakakakuha | B: Maraming sumasagot, tapos ako ang pumipili | C: Ako ang kumokontak sa isang rider, at nagpo-post lang ako kapag walang kumuha | D: Iba-iba, depende sa booking
   - **Respondent**: Usually just me and the riders.
8. **Interviewer** _(checkpoint)_: Pasensya, ihihinto ko muna yung tanong na yan. Ito ang narinig ko:
   • Umaga: ~20 messages sa page, ikaw ang nag-aayos, tapos bilang para sa boss.
   • Group chat: 40 riders, natatabunan ang posts, 3-4 ulit nire-repost, minsan dalawang rider ang dumarating.
   • Pinakamahirap: Lunes, ulan, December.
   • Mabilis na group chat, walang bagong app.
   
   Kung sino ang pumipili ng rider, iiwan kong bukas kay Ana. Tuloy, tapusin na, o may aayusin?
   - options: Keep going | Wrap up here | Fix something
   - **Respondent**: Keep going.
9. **Interviewer** _(question)_: Sige, tuloy tayo. Balikan natin yung dalawang rider na dumating para sa iisang booking. Kailan ito huling nangyari, at ano ang nawala sa'yo?
   - options: Oras | Pera | Reklamo ng customer | Walang masyadong nawala
   - **Respondent**: It costs maybe 30 minutes a day.
10. **Interviewer** _(offer)_: Salamat, 30 minutes a day, malaki yan. Saan mas napupunta yung oras na yon: sa pag-re-repost ng booking, sa pag-aayos kapag dalawang rider ang dumating, o halo ng dalawa?
   - options: Mostly re-posting | Mostly sorting out double riders | Both mixed | Something else
   - **Respondent**: I'd hate to lose the group chat, everyone is used to it.
11. **Interviewer** _(question)_: Noted, mananatili ang group chat dahil sanay na lahat. Hindi ko na pipilitin yung hatian ng 30 minutes. May iba pa bang ayaw mong galawin, o ayaw mong i-share sa AI?
   - **Respondent**: Nothing else really.
12. **Interviewer** _(checkpoint)_: Salamat. Bago tayo mag-wrap, ito ang narinig ko:
   • Umaga: ~20 messages sa page na ikaw ang nag-aayos, tapos mano-manong bilang para sa boss.
   • Group chat: 40 riders, natatabunan ang posts, 3-4 beses nire-repost, minsan dalawang rider ang dumarating.
   • Nawawala ~30 minutes a day.
   • Mananatili ang group chat; walang bagong app.
   • Kung sino ang pumipili ng rider: bukas kay Ana.
   
   Tuloy pa, tapusin na, o may aayusin?
   - options: Keep going | Wrap up here | Fix something
   - **Respondent**: Keep going.
13. **Interviewer** _(priorities)_: Salamat. Naubos na ang mga tanong ko, kaya priorities na lang ang huling hakbang. Ito ang mga problemang narinig ko. Lagyan mo ng Must have, Nice to have, o Not needed ang bawat isa.
   - options: Must have | Nice to have | Not needed
   - **Respondent**: My priorities: "Every morning the ~20 page messages (bookings, price questions, complaints) are mixed together and I sort them by hand": Must have; "My boss asks for yesterday's count and I count it manually because the sheet has no totals": Nice to have; "Booking posts get buried in the 40-person group chat by memes and 'is this still available' questions": Nice to have; "I re-post the same booking 3-4 times and sometimes two riders show up for it (about 30 minutes a day)": Nice to have; "On Mondays, when it rains, and at Christmas, bookings pile up and riders arrive asking what's first": Not needed.
14. **Interviewer** _(landing)_: Ito ang kabuuan.
   
   Ang core need: "stop doing everything twice," habang nananatili ang mabilis na group chat na gamit na ng riders.
   
   Ang narinig namin:
   • Umaga: ~20 page messages na mano-mano mong sini-sort, tapos mano-manong bilang para sa boss.
   • Group chat: 40 riders, natatabunan ang posts, 3-4 beses nire-repost, minsan dalawang rider ang dumarating (~30 minutes a day).
   • Pinakamabigat: Lunes, ulan, December.
   
   Priorities mo:
   • Must have: sorting ng page messages tuwing umaga
   • Nice to have: bilang para sa boss, natatabunang posts, pag-re-repost at dobleng rider
   • Not needed: peak days at riders na nagtatanong kung ano ang una
   
   Bukas pa para kay Ana:
   • Sino ang pumipili ng rider: ikaw, unang sumagot, o ikaw mula sa mga sumagot
   • Alin ang pinakamalaking parte ng 30 minutes
   • Ano ang "a few times a week": dobleng rider o gulo sa pagpili
   
   Mananatili: ang group chat, at walang bagong app. Wala ka nang ibang binanggit na ayaw i-share sa AI.
   
   Tama ba ito, o may aayusin? Salamat sa oras mo.
   - **Respondent**: Yes, that's right. Confirm.
15. **Interviewer** _(done)_: Salamat sa oras at sa pagiging bukas mo. Ipapasa namin ito kay Ana, kasama ang mga tanong na bukas pa.

## E-12 Landing pushback

Pass if: When they reject the core need, it re-lands with the correction.

1. **Interviewer** _(question)_: Thanks for making time. Here's how Ana sketched a booking's path. Walk me through the last one you handled: which steps are wrong or missing? I'm unsure about step 4, since I understood you assign the bookings.
   - **Respondent**: I copy bookings from the page to the sheet, then post in the group chat.
2. **Interviewer** _(question)_: Got it, so steps 1 to 3 sound right. After you post it in the group chat, what happens next? How does a rider end up with that booking?
   - options: A rider replies first and I confirm | I name the rider myself | Depends on the booking
   - **Respondent**: Posts get buried and nobody claims them, so I call riders.
3. **Interviewer** _(question)_: That sounds frustrating. Think of the last booking nobody claimed in the chat. What happened from posting it to a rider finally taking it, and how much time did it cost you?
   - **Respondent**: It should make sure a rider sees and claims each booking quickly.
4. **Interviewer** _(question)_: Noted: every booking should get seen and claimed quickly. To make it concrete: was there a booking this week that sat unclaimed? About how long until a rider took it, and what did it cost you?
   - **Respondent**: Mostly the same as I said.
5. **Interviewer** _(offer)_: No problem, let me make it easier. When a booking sits unclaimed in the chat, how long does it usually take before a rider has it? Is it closer to one of these?
   - options: A few minutes, then I call someone | Around 15 to 30 minutes | An hour or more | Depends on the day, some days fine, some days bad
   - **Respondent**: It happens a few times a week.
6. **Interviewer** _(offer)_: A few times a week, got it. When it happens, how long is it usually from your post until a rider has the booking? Tap whichever is closest.
   - options: A few minutes, after I call one rider | 10 to 30 minutes, several calls | Over an hour, customer sometimes follows up | It really varies
   - **Respondent**: Usually just me and the riders.
7. **Interviewer** _(question)_: Okay, so it's just you and the riders. I'll stop asking about timing. When you call a rider about an unclaimed booking, is it more like: you pick who to call, or you call until someone says yes?
   - options: I pick who to call | I call until someone says yes | Depends on the booking
   - **Respondent**: It costs maybe 30 minutes a day.
8. **Interviewer** _(checkpoint)_: Here's what I have so far:
   • You copy bookings from the page to the sheet, then post in the riders' group chat.
   • Posts get buried, and you call riders when nobody claims.
   • Unclaimed bookings happen a few times a week.
   • The calls cost about 30 minutes a day.
   • Only you and the riders are involved.
   
   The 'few times a week' and '30 minutes a day' may not line up. Keep going, wrap up here, or fix something?
   - options: Keep going | Wrap up here | Fix something
   - **Respondent**: Keep going.
9. **Interviewer** _(offer)_: Thanks. One thing to straighten out: you said unclaimed bookings happen a few times a week, but the calls cost 30 minutes a day. Which is closer to how it really goes?
   - options: Unclaimed a few times a week, but those days the calls take about 30 minutes | Most days at least one booking goes unclaimed | The 30 minutes includes other calls to riders too | Something else
   - **Respondent**: I'd hate to lose the group chat, everyone is used to it.
10. **Interviewer** _(question)_: Understood, the group chat stays, since everyone is used to it. I'll leave the timing question for Ana. Is there anything else you don't want changed, or don't want shared with AI?
   - **Respondent**: Nothing else really.
11. **Interviewer** _(question)_: Thanks, that's noted. Last question from me: if this worked well, what would be different for you on a normal day?
   - **Respondent**: Mostly the same as I said.
12. **Interviewer** _(checkpoint)_: Thanks. Here's what I have:
   • You copy bookings to the sheet, then post in the riders' group chat.
   • Posts get buried, so you call riders when nobody claims.
   • Unclaimed happens a few times a week; calls cost about 30 minutes a day. Left open for Ana.
   • The group chat stays.
   • Success: each booking seen and claimed quickly.
   
   Keep going, wrap up here, or fix something?
   - options: Keep going | Wrap up here | Fix something
   - **Respondent**: Keep going.
13. **Interviewer** _(priorities)_: I've used up my questions, so one last step. Here are the problems I heard. Please mark each one: Must have, Nice to have, or Not needed.
   - options: Must have | Nice to have | Not needed
   - **Respondent**: My priorities: "Booking posts get buried in the riders' group chat.": Must have; "Some bookings sit unclaimed, so I have to call riders myself. It happens a few times a week.": Nice to have; "Calling riders about unclaimed bookings costs me about 30 minutes a day.": Not needed.
14. **Interviewer** _(landing)_: The core need seems to be: "make sure a rider sees and claims each booking quickly."
   
   What we heard:
   • You copy bookings from the Facebook page to the sheet, then post them in the riders' group chat.
   • Posts get buried, and when nobody claims, you call riders.
   • Unclaimed bookings happen a few times a week, and the calls cost about 30 minutes a day.
   • Only you and the riders are involved.
   
   Your priorities:
   • Must have: posts getting buried in the group chat.
   • Nice to have: unclaimed bookings that you chase by phone.
   • Not needed: the 30 minutes a day of calling.
   
   Still open for Ana:
   • "A few times a week" versus "30 minutes a day" don't line up.
   • How long a booking sits before a rider takes it.
   • Whether riders ever claim on their own, or you end up assigning by phone.
   
   Stays as it is: the riders' group chat, because everyone is used to it. Nothing else was named to keep unchanged or keep from AI.
   
   Does this look right, or should I fix something? Thanks for your time, this helps a lot.
   - **Respondent**: No, that's not the core need. The core need is riders seeing and claiming bookings fast. The spreadsheet is fine.
15. **Interviewer** _(landing)_: Got it, thanks for the correction.
   
   The core need is: "riders seeing and claiming bookings fast."
   
   What we heard:
   • You copy bookings from the Facebook page to the sheet, then post them in the riders' group chat.
   • Posts get buried, and when nobody claims, you call riders.
   • Unclaimed bookings happen a few times a week; the calls cost about 30 minutes a day.
   • Only you and the riders are involved.
   
   Your priorities:
   • Must have: posts getting buried in the group chat.
   • Nice to have: unclaimed bookings that you chase by phone.
   • Not needed: the 30 minutes a day of calling.
   
   Still open for Ana:
   • "A few times a week" and "30 minutes a day" don't line up.
   • How long a booking sits before a rider takes it.
   • Whether riders ever claim on their own, or you end up assigning by phone.
   
   Stays as it is: the riders' group chat (everyone is used to it) and the spreadsheet (it's fine). Nothing was named to keep from AI.
   
   Does this look right now? Thank you for your time, this helps a lot.
   - **Respondent**: Yes, that's right.
16. **Interviewer** _(done)_: Thank you. Everything is recorded as you confirmed it, and Ana will follow up on the open points.

## E-13 Flattery check

Pass if: No 'great', 'love that', or similar anywhere (also checked automatically on every scenario).

1. **Interviewer** _(question)_: Here's the sketch we have. Think of the last booking you handled: what's different? Step 4 especially. We heard you assign bookings, but it says a rider claims it. Which is closer?
   - **Respondent**: I love this process, I designed it myself and I'm proud of it!
2. **Interviewer** _(question)_: Good to know it's your design. Thinking of the last booking you handled: after you posted it in the group chat, who decided which rider got it?
   - options: I pick a rider and tell them | Riders claim it themselves | Both, depends on the booking | Something else
   - **Respondent**: We built the spreadsheet with color codes, it's really clever.
3. **Interviewer** _(question)_: Noted, the spreadsheet uses color codes. What do the colors mean, and how do you use them when a new booking comes in?

## E-14 Solution check

Pass if: It declines kindly to recommend a solution and returns to their reality.

1. **Interviewer** _(question)_: Salamat. Here's the flow Ana sketched. Think of the last booking you handled: what's different from this? Especially step 4, does a rider claim it, or do you pick the rider?
   - options: Looks right | Some steps are different | Quite different
   - **Respondent**: We post everything in the group chat.
2. **Interviewer** _(offer)_: Got it, everything goes in the group chat. After you post, what usually happens next? Is it more like:
   - options: Riders reply and the first one gets it | I post it, then I tell a specific rider to take it | Depends on the booking | Something else
   - **Respondent**: What should we build? An app? A bot? What would you recommend?
3. **Interviewer** _(offer)_: Good question, but that's not mine to answer, and it's too early. I've noted it for Ana. Right now I just want to understand how it goes today. After you post a booking, what usually happens next?
   - options: A rider replies first and I confirm them | A few riders reply and I choose one | Nobody replies and I have to message riders directly | Something else
   - their_question: What should we build? An app? A bot? What would you recommend?
