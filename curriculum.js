/* Learnb — müfredat, seviye testi, sohbet konuları ve hazır ilk ders.
   Her ders: [kimlik, Türkçe başlık, Türkçe hedef, İngilizce odak (ders üretimi için)] */
window.LEARNB_DATA = {
  levels: [
    { id: 'A1', name: 'Başlangıç', note: 'Hiç bilmiyorum ya da çok az biliyorum.' },
    { id: 'A2', name: 'Temel', note: 'Basit cümleler kurabiliyorum.' },
    { id: 'B1', name: 'Orta', note: 'Günlük konuları konuşabiliyorum.' },
    { id: 'B2', name: 'İleri-orta', note: 'Rahatım ama daha doğal olmak istiyorum.' },
    { id: 'C1', name: 'İleri', note: 'Akıcıyım; ince anlamları ve resmî dili geliştirmek istiyorum.' },
    { id: 'C2', name: 'Ustalık', note: 'Ana dili gibi kullanmaya yakınım; inceliklere odaklanmak istiyorum.' }
  ],

  units: [
    { level: 'A1', t: 'Merhaba!', lessons: [
      ['a1-01', 'Selamlaşma ve vedalaşma', 'Selam ver, hal hatır sor, vedalaş.', 'Greetings and goodbyes: Hello/Hi, Good morning/afternoon/evening, Good night (only when leaving), How are you? — I\'m fine, thanks. And you?, Bye, See you (tomorrow).'],
      ['a1-02', 'Kendini tanıtmak', 'Adını söyle, karşındakinin adını sor.', 'Introducing yourself: My name is…, I\'m…, What\'s your name?, Nice to meet you. — Nice to meet you too. Spelling a name (How do you spell it?). Treat I\'m as a fixed chunk; full verb "to be" comes in the next lesson.'],
      ['a1-03', '"to be" fiili: am, is, are', '"Ben öğretmenim", "O mutlu" gibi cümleler kur.', 'Verb to be, affirmative: I am, you/we/they are, he/she/it is; contractions I\'m, you\'re, he\'s, it\'s. Turkish suffixes (-im, -sin) match am/is/are; Turkish speakers often drop the verb ("I teacher"). Jobs and adjectives: I am a nurse. She is happy.'],
      ['a1-04', 'Nerelisin?', 'Ülkeni ve milliyetini söyle, başkasına sor.', 'Where are you from? I\'m from Türkiye. I\'m Turkish. Countries vs nationalities (Germany–German, England–English, Spain–Spanish, Japan–Japanese, the USA–American). Countries and nationalities always start with a capital letter.'],
      ['a1-05', 'Sayılar ve yaş', '1–100 arası sayılar, yaşını söyle ve sor.', 'Numbers 1–100 (thirteen vs thirty), How old are you? I\'m 25 (years old). Never "I have 25 years" — a typical Turkish-speaker mistake. Saying phone numbers digit by digit.'],
      ['a1-06', 'Sorular ve kısa cevaplar', '"Are you…?" "Is she…?" diye sor ve cevapla.', 'Questions and negatives with to be: Are you a student? Yes, I am. / No, I\'m not. Is he…? Yes, he is. / No, he isn\'t. The verb comes before the subject in questions. Negatives: I\'m not, isn\'t, aren\'t.']
    ]},
    { level: 'A1', t: 'Etrafımdaki dünya', lessons: [
      ['a1-07', 'a / an', 'Tekil nesnelerden bahset: a book, an apple.', 'Indefinite articles a/an with singular countable nouns; an before vowel sounds (an apple, an hour, but a university). Jobs need an article: She is a doctor (Turkish just says "O doktor"). What\'s this? It\'s a pen.'],
      ['a1-08', 'Çoğul isimler', 'Birden fazla şeyden bahset: books, boxes, children.', 'Plural nouns: -s, -es (boxes, watches), -ies (cities), irregular plurals (men, women, children, people, feet, teeth). After numbers English uses the plural (two cats) while Turkish uses the singular (iki kedi) — a common mistake.'],
      ['a1-09', 'this, that, these, those', 'Yakındaki ve uzaktaki şeyleri göster.', 'Demonstratives this/that (singular) and these/those (plural) for near and far; What is this? What are those? These are my keys. That is my car.'],
      ['a1-10', 'my, your, his, her…', 'Sahiplik söyle: my phone, her name.', 'Possessive adjectives my, your, his, her, its, our, their. His vs her depends on the owner (Turkish "onun" has no gender). Who\'s this? This is my brother.'],
      ['a1-11', 'Aile ve \'s ile sahiplik', 'Aileni anlat: my sister\'s car.', 'Family words (mother, father, brother, sister, son, daughter, wife, husband, parents, grandparents) and possessive \'s (Ali\'s car, my mother\'s name) vs plural -s. I have a brother / I have got two sisters.'],
      ['a1-12', 'Renkler ve sıfatlar', 'Bir şeyi tarif et: a big red car.', 'Colours and common adjectives (big, small, old, new, beautiful, cheap, expensive); the adjective comes before the noun and is never plural (red cars, not reds cars); The car is red. a/an + adjective + noun (an old house).']
    ]},
    { level: 'A1', t: 'Günlük hayat', lessons: [
      ['a1-13', 'Geniş zaman: I work', 'Her gün yaptığın şeyleri anlat.', 'Present simple for habits and facts with I/you/we/they: I work in a bank. We live in Izmir. They drink tea. Daily verbs: get up, go, eat, drink, work, study, watch, read.'],
      ['a1-14', 'Geniş zaman: he/she/it + s', 'Başkasının rutinini anlat: She works.', 'Present simple third person -s/-es/-ies: he works, she watches, it goes, he studies, she has. The most common mistake is forgetting -s (She work).'],
      ['a1-15', 'Olumsuz: don\'t / doesn\'t', 'Yapmadığın şeyleri söyle.', 'Present simple negatives: I don\'t eat meat. She doesn\'t work on Sundays. After doesn\'t the verb has no -s (She doesn\'t works is wrong).'],
      ['a1-16', 'Sorular: Do you…? Does she…?', 'Alışkanlıklar hakkında soru sor.', 'Present simple yes/no questions with short answers (Do you like tea? Yes, I do. Does he live here? No, he doesn\'t.) and wh- questions (Where do you work? What does she do?).'],
      ['a1-17', 'Ne sıklıkla?', 'always, usually, sometimes, never ile sıklık belirt.', 'Adverbs of frequency always, usually, often, sometimes, rarely, never: before the main verb but after be (I always get up early. She is never late.). How often do you…? once/twice a week.'],
      ['a1-18', 'Saatler ve günlük rutin', 'Saati sor, rutinini saatlerle anlat.', 'Telling the time (It\'s seven o\'clock, half past six, quarter to nine, 7:15), What time is it? What time do you get up? at + time, in the morning/afternoon/evening, at night, on + days of the week.']
    ]},
    { level: 'A1', t: 'Ev, şehir, zevkler', lessons: [
      ['a1-19', 'There is / There are', 'Bir yerde ne olduğunu söyle.', 'There is / there are for existence (There\'s a park near my house. There are two bedrooms.), negatives and questions (Is there a…? Are there any…?) — the English for Turkish "var / yok".'],
      ['a1-20', 'Yer edatları', 'Bir şeyin nerede olduğunu anlat.', 'Prepositions of place in, on, under, next to, between, behind, in front of, opposite; Where is the key? It\'s on the table. in the kitchen, on the wall, at home, at work.'],
      ['a1-21', 'can / can\'t', 'Yapabildiğin ve yapamadığın şeyleri söyle.', 'can/can\'t for ability and simple requests: I can swim. She can\'t drive. Can you speak English? Yes, I can. No "to" and no -s after can (He can plays is wrong). Can I…? / Can you…?'],
      ['a1-22', 'Sevdiklerin: like + -ing', 'Hobilerini ve zevklerini anlat.', 'like/love/enjoy/hate/don\'t mind + -ing (I love reading. She hates getting up early.) and like + noun. Do you like…? What do you like doing? Spelling of -ing (running, making).'],
      ['a1-23', 'Yol tarifi', 'Yol sor ve yol tarif et.', 'Imperatives (Turn left. Go straight on. Don\'t stop. Take the second street on the right.) and asking for directions (Excuse me, where is the station? How can I get to…? Is it far?). Polite "please".'],
      ['a1-24', 'Şimdiki zaman', 'Şu an olan şeyleri anlat: I am working.', 'Present continuous am/is/are + -ing for actions happening now (I\'m cooking. They\'re watching TV.), negatives and questions (What are you doing?), contrast with present simple (I work every day vs I\'m working now). now, at the moment.']
    ]},

    { level: 'A2', t: 'Geçmişe yolculuk', lessons: [
      ['a2-01', 'was / were', 'Geçmişte nerede ve nasıl olduğunu söyle.', 'Past of to be: was/were, wasn\'t/weren\'t, Was she…? Yes, she was. Where were you yesterday? I was at home. I was born in 1995 (not "I born").'],
      ['a2-02', 'Geçmiş zaman: düzenli fiiller', 'Dün yaptıklarını -ed ile anlat.', 'Past simple of regular verbs with -ed (worked, played, studied, stopped), a short note on the three pronunciations of -ed, time words yesterday, last night.'],
      ['a2-03', 'Düzensiz fiiller', 'En sık düzensiz fiillerle geçmişi anlat.', 'The most common irregular past forms: go–went, have–had, see–saw, eat–ate, get–got, make–made, take–took, come–came, buy–bought, meet–met, say–said, do–did — practised in sentences.'],
      ['a2-04', 'Geçmişte olumsuz ve soru', 'didn\'t ve "Did you…?" kullan.', 'Past simple negatives and questions with did/didn\'t + base verb (I didn\'t go. Did you see it? Where did you go?). Typical mistake: I didn\'t went.'],
      ['a2-05', 'Ne zaman oldu?', 'ago, last, in, on, at ile zamanı belirt.', 'Past time expressions: ago (two days ago), last week/month/year, in 2010, on Monday, at 5 pm, yesterday morning; When did you…?; time phrases usually go at the end of the sentence.'],
      ['a2-06', 'Bir olay anlatmak', 'first, then, after that ile hafta sonunu anlat.', 'Telling a past story in order: first, then, after that, later, finally; joining with and/but/so; describing last weekend in 4–5 past simple sentences.']
    ]},
    { level: 'A2', t: 'Alışveriş ve yemek', lessons: [
      ['a2-07', 'some ve any', 'Sayılabilen ve sayılamayan isimlerle some/any kullan.', 'Countable vs uncountable nouns (apples vs water, bread, money, information), some in positive sentences and offers, any in negatives and questions, a/an only with singular countable nouns.'],
      ['a2-08', 'How much / How many', 'Miktar ve fiyat sor, söyle.', 'How much (uncountable, prices) vs How many (countable); a lot of, much (in negatives/questions), many, a few, a little; How much is it? It\'s 20 lira.'],
      ['a2-09', 'Restoranda', 'Sipariş ver, hesap iste.', 'Ordering politely: I\'d like…, Can I have…?, I\'ll have the…, What would you like? Would you like anything to drink? Could I have the bill, please?'],
      ['a2-10', 'Mağazada', 'Fiyat sor, beden iste, dene.', 'Shopping: Can I try this on? Do you have it in a bigger size / in blue? How much is this? I\'m just looking, thanks. It\'s too small / too expensive. I\'ll take it.'],
      ['a2-11', 'Karşılaştırma: bigger, more expensive', 'İki şeyi karşılaştır.', 'Comparative adjectives: -er (cheaper, bigger, easier), more + long adjectives (more expensive), irregular good–better, bad–worse, far–farther; than. Typical mistake: more cheaper. as … as for equality.'],
      ['a2-12', 'En üstünlük: the biggest', 'Bir grubun "en"ini söyle.', 'Superlatives: the -est (the tallest, the biggest, the happiest), the most + long adjectives, irregular the best / the worst, with in/of (the best restaurant in town).']
    ]},
    { level: 'A2', t: 'Planlar ve gelecek', lessons: [
      ['a2-13', 'be going to', 'Planlarını ve niyetlerini anlat.', 'be going to for plans and intentions (I\'m going to visit my aunt.), negatives and questions (Are you going to…?), predictions from what you can see (Look at those clouds! It\'s going to rain.).'],
      ['a2-14', 'Şimdiki zamanla gelecek', 'Kesinleşmiş randevularını anlat.', 'Present continuous for fixed future arrangements with a time word (I\'m meeting Ali tomorrow. We\'re flying to Rome on Friday.), What are you doing this weekend?'],
      ['a2-15', 'will', 'Anlık karar, söz ve tahmin bildir.', 'will for instant decisions (I\'ll have the soup.), offers and promises (I\'ll help you. I won\'t tell anyone.), opinions about the future (I think it will be sunny.); basic contrast with going to.'],
      ['a2-16', 'Davet etmek', 'Davet et, kabul et, kibarca reddet.', 'Invitations: Would you like to come…?, Do you want to…?, How about…?, Why don\'t we…?; accepting (I\'d love to. Sounds great!) and refusing politely (I\'m afraid I can\'t. I\'m busy then. Maybe another time.).'],
      ['a2-17', 'Hava durumu', 'Havayı anlat ve tahmin et.', 'Weather words (sunny, cloudy, rainy, windy, snowy, foggy, hot, cold, warm, degrees), What\'s the weather like? It\'s raining (now) vs It rains a lot here (habit), weather predictions with will / going to.'],
      ['a2-18', 'Tatil planı', 'Bir tatili baştan sona planla.', 'Travel words (book a hotel, flight, passport, luggage, sightseeing, beach) combined with all the future forms learned so far to make and discuss a holiday plan.']
    ]},
    { level: 'A2', t: 'Deneyimler ve tavsiyeler', lessons: [
      ['a2-19', 'Have you ever…?', 'Hayat deneyimlerini anlat.', 'Present perfect for life experiences: have/has + past participle, Have you ever been to…? I\'ve never eaten sushi. been vs gone; common past participles.'],
      ['a2-20', 'just, already, yet', 'Yakın zamanda olanları söyle.', 'Present perfect with just, already, yet (I\'ve just finished. Have you done it yet? I haven\'t called him yet.) and where these words go in the sentence.'],
      ['a2-21', 'Present perfect mi, past simple mı?', 'İki zamanı doğru seç.', 'Present perfect (no specific time, life experience, result now) vs past simple (finished time: yesterday, in 2019, ago). Typical mistake: I have seen him yesterday. Have you ever…? → When did you…?'],
      ['a2-22', 'should / shouldn\'t', 'Tavsiye ver ve iste.', 'should/shouldn\'t for advice (You should see a doctor.), What should I do? I think you should…, Maybe you should…; no "to" after should.'],
      ['a2-23', 'have to, must, don\'t have to', 'Zorunluluk ve gerekliliği anlat.', 'have to/has to (outside obligation), must (strong personal feeling or rule), mustn\'t (not allowed) vs don\'t have to (not necessary) — the key contrast; Do you have to…? Past: had to.'],
      ['a2-24', 'Doktorda', 'Şikâyetini anlat, tavsiye al.', 'Health: What\'s the matter? I have a headache / a stomachache / a cold / a fever, my back hurts, I feel sick, I\'ve had it for two days; the doctor\'s advice with should; at the pharmacy.']
    ]},

    { level: 'B1', t: 'Hikâye anlatmak', lessons: [
      ['b1-01', 'Past continuous', 'Geçmişte süren olayları anlat.', 'Past continuous was/were + -ing for actions in progress at a past moment (At 8 pm I was having dinner.) and for setting the scene of a story.'],
      ['b1-02', 'when ve while', 'İki geçmiş olayı birbirine bağla.', 'Past continuous + past simple with when/while (I was walking home when it started to rain. While she was cooking, the phone rang.) — interrupted actions.'],
      ['b1-03', 'used to', 'Eski alışkanlıklarını anlat.', 'used to + base verb for past habits and states (I used to live in Ankara. I didn\'t use to like coffee. Did you use to…?), with a short note that "be used to" is different.'],
      ['b1-04', 'Past perfect', 'Geçmişteki bir olaydan önce olanı anlat.', 'Past perfect had + past participle for the earlier of two past actions (When I arrived, the film had already started.), by the time; contrast with a simple sequence in past simple.'],
      ['b1-05', 'although, however, because, so', 'Fikirleri mantıklı şekilde bağla.', 'Linking ideas: because/so (reason/result), but/although/even though (contrast inside a sentence), however (contrast between sentences, with its punctuation), as a result.'],
      ['b1-06', 'Etkileyici anlatım', 'suddenly, eventually gibi zarflarla hikâyeni renklendir.', 'Storytelling: adverbs (suddenly, luckily, unfortunately, eventually, in the end), adjective vs adverb (quick/quickly), using the narrative tenses together.']
    ]},
    { level: 'B1', t: 'Koşullar ve olasılıklar', lessons: [
      ['b1-07', 'If it rains, I\'ll stay', 'Gerçek koşulları anlat.', 'Zero conditional (If you heat ice, it melts.) and first conditional (If it rains, I\'ll stay at home.). No will in the if-clause (If it will rain is wrong). when vs if.'],
      ['b1-08', 'If I had…, I would…', 'Hayali durumları anlat.', 'Second conditional for imaginary present/future situations (If I had more time, I would learn the guitar.), If I were you, I\'d…; contrast with the first conditional.'],
      ['b1-09', 'unless, as long as, in case', 'Koşulları farklı yollarla söyle.', 'unless (= if not), as long as / provided that, in case for precautions (Take an umbrella in case it rains.); present tense after all of them.'],
      ['b1-10', 'may, might, could', 'Emin olmadığın şeyleri söyle.', 'Modals of possibility may/might/could (It might rain later. She may be at work.), might not; perhaps, maybe, probably; degrees of certainty.'],
      ['b1-11', 'must be / can\'t be', 'Kanıta dayanarak çıkarım yap.', 'Deduction about the present: must (sure it is true), can\'t (sure it is not true), might/could (possible): He must be tired. That can\'t be Tom — he\'s in Paris.'],
      ['b1-12', 'I wish I had…', 'Şimdiki durumla ilgili dileklerini anlat.', 'wish + past simple for present wishes (I wish I had a car. I wish I lived by the sea. I wish I were taller.), wish + could, If only…']
    ]},
    { level: 'B1', t: 'Fikirler ve iletişim', lessons: [
      ['b1-13', 'Fikir belirtmek', 'Fikrini net ve kibar söyle.', 'Giving opinions: I think / I don\'t think (not "I think not"), In my opinion, Personally, As far as I\'m concerned, I\'m not sure; asking: What do you think about…? How do you feel about…?'],
      ['b1-14', 'Katılmak ve katılmamak', 'Kibarca katıl ya da itiraz et.', 'Agreeing and disagreeing politely: I agree (not "I am agree"), Exactly, That\'s true, I see your point, but…, I\'m not so sure, I\'m afraid I disagree; So do I / Neither do I.'],
      ['b1-15', 'Dolaylı sorular', '"Could you tell me where…?" ile kibar sor.', 'Indirect questions: Could you tell me where the station is? (no inversion), Do you know what time it opens?, I wonder if…; if/whether for yes/no questions.'],
      ['b1-16', 'who, which, that, where', 'Bir isme bilgi ekleyen cümleler kur.', 'Defining relative clauses with who (people), which/that (things), where (places), whose; leaving out the pronoun when it is the object; compare with Turkish -en / -dığı structures.'],
      ['b1-17', '-ing mi, to mu?', 'Fiillerden sonra doğru yapıyı seç.', 'Verb patterns: enjoy/finish/avoid/mind + -ing; want/decide/hope/plan/need + to-infinitive; like/love/start + both; stop/remember/try change meaning (stop smoking vs stop to smoke).'],
      ['b1-18', 'Phrasal verbs: günlük hayat', 'En sık kullanılan deyimsel fiilleri öğren.', 'Everyday phrasal verbs: get up, wake up, look for, look after, turn on/off, put on, take off, give up, find out, go out; separable (turn it off) vs inseparable (look after her).']
    ]},
    { level: 'B1', t: 'İş ve resmî İngilizce', lessons: [
      ['b1-19', 'I\'ve been working…', 'Bir şeyi ne zamandır yaptığını anlat.', 'Present perfect continuous have/has been + -ing for duration up to now (I\'ve been working here for three years. How long have you been waiting?), for vs since. Turkish speakers often say "I am working here for 3 years" — wrong.'],
      ['b1-20', 'Edilgen yapı', 'Bir şeyin yapıldığını anlat: It was built in 1890.', 'Passive voice in present and past simple (English is spoken here. The bridge was built in 1890.), by + agent, when to use the passive; past participles.'],
      ['b1-21', 'Birinin sözlerini aktarmak', 'Birinin söylediğini başkasına aktar.', 'Reported statements with said/told (She said (that) she was tired. He told me he would call.), basic tense backshift, say vs tell (tell + person).'],
      ['b1-22', 'Soruları ve ricaları aktarmak', 'Sorulan soruları ve ricaları aktar.', 'Reported questions (He asked me where I lived. She asked if I was ready.) with statement word order; reported requests and orders (She told me to wait. He asked me not to be late.).'],
      ['b1-23', 'E-posta yazmak', 'Resmî ve yarı resmî e-posta kalıplarını kullan.', 'Email phrases: Dear Mr/Ms…, Hi Sam, I\'m writing to…, Could you please…?, I would be grateful if…, Please find attached…, I look forward to hearing from you, Best regards / Kind regards; formal vs informal.'],
      ['b1-24', 'İş görüşmesi', 'Kendini, deneyimini ve güçlü yönlerini anlat.', 'Job interview language: Tell me about yourself, I have experience in…, I\'m responsible for…, My strengths are…, I\'m good at…, I\'m interested in this position because…, Do you have any questions?']
    ]},

    { level: 'B2', t: 'İnce anlamlar', lessons: [
      ['b2-01', 'If I had known…', 'Geçmişte farklı olsaydı ne olurdu, anlat.', 'Third conditional (If I had studied, I would have passed.), would have / could have / might have; regrets and criticism; contraction I\'d have.'],
      ['b2-02', 'Karışık koşul cümleleri', 'Geçmiş ve şimdiyi koşulla bağla.', 'Mixed conditionals: past condition → present result (If I had taken the job, I would be rich now.) and present condition → past result (If I were braver, I would have said something.).'],
      ['b2-03', 'Pişmanlıklar: wish, if only', 'Geçmişe dair pişmanlıklarını ifade et.', 'wish / if only + past perfect for past regrets (I wish I had listened.), wish + would for annoyance (I wish you would stop.), contrast with wish + past simple.'],
      ['b2-04', 'should have, could have, must have', 'Geçmiş hakkında yorum ve çıkarım yap.', 'Modal perfects: should have (criticism, regret), could have (a missed possibility), must have / can\'t have / might have (deduction about the past): She must have forgotten.'],
      ['b2-05', 'Gelecekte bir an', 'Gelecekte belli bir anda ne olacağını anlat.', 'Future continuous (This time tomorrow I\'ll be flying to London.) and future perfect (By 2030 I\'ll have finished my degree.), by + time.'],
      ['b2-06', 'Phrasal verbs: iş ve ilişkiler', 'İş ve ilişkilerde doğal deyimsel fiiller kullan.', 'Phrasal verbs for work and relationships: put off, come up with, carry out, run out of, get along with, fall out with, look forward to, turn down, bring up, deal with.']
    ]},
    { level: 'B2', t: 'Doğal konuşmak', lessons: [
      ['b2-07', 'make, do, have, take', 'Kelimeleri doğal eşleriyle kullan.', 'Collocations: make (a decision, a mistake, money, progress) vs do (homework, business, your best, a favour), have/take (a break, a shower, a photo, a look); the Turkish "yapmak" trap.'],
      ['b2-08', 'Günlük deyimler', 'Konuşmada sık geçen deyimleri anla ve kullan.', 'Common idioms: break the ice, a piece of cake, under the weather, hit the books, call it a day, on the same page, once in a blue moon, cost an arm and a leg; meaning and when to use them.'],
      ['b2-09', 'whereas, despite, on the other hand', 'Karşıt fikirleri dengeli bağla.', 'Contrast linkers: whereas/while, despite / in spite of + noun or -ing, although + clause, on the other hand, nevertheless. Typical mistakes: "despite of", "although + noun".'],
      ['b2-10', 'Vurgu: What I need is…', 'Cümlenin bir kısmını öne çıkar.', 'Cleft sentences for emphasis: What I need is a holiday. It was Ali who called. The thing is… All I want is…'],
      ['b2-11', 'Yumuşatarak konuşmak', 'Fikrini daha yumuşak ve kibar söyle.', 'Hedging and softening: I tend to think, It seems that, It might be better to, I\'d say, sort of / kind of (informal), a bit, slightly; softening criticism (It\'s not exactly what we expected.).'],
      ['b2-12', 'Question tags: isn\'t it?', 'Onay isteyen soru eklerini kullan.', 'Question tags (It\'s cold, isn\'t it? You don\'t smoke, do you? She\'ll come, won\'t she? I\'m late, aren\'t I?), checking vs real questions; echo responses (Oh, do you?).']
    ]},
    { level: 'B2', t: 'Yazı ve tartışma', lessons: [
      ['b2-13', 'have something done', 'Bir işi başkasına yaptırdığını anlat.', 'Causative have/get something done (I had my hair cut. I\'m getting my car repaired.) and impersonal passive (It is said that…, He is believed to be…).'],
      ['b2-14', 'Never have I…', 'Devrik yapıyla vurgu yap.', 'Inversion for emphasis in formal English: Never have I seen…, Rarely do we…, Not only did she…, but she also…, Hardly had I… when…, Only then did I…'],
      ['b2-15', 'Having finished…', 'Cümleleri -ing ve -ed yapılarıyla kısalt.', 'Participle clauses: Walking down the street, I saw…; Having finished the report, she left; Written in 1990, the book…; the same-subject rule (avoid dangling participles).'],
      ['b2-16', 'Fikir paragrafı yazmak', 'Giriş, gerekçe ve sonuçla düzenli yaz.', 'Structuring an opinion paragraph: topic sentence, reasons with examples (Firstly, Moreover, For instance), a concession (Admittedly…), a conclusion (Overall, To sum up).'],
      ['b2-17', 'Resmî ve gündelik dil', 'Duruma göre doğru üslubu seç.', 'Register: formal vs informal pairs (get → obtain/receive, ask for → request, help → assist, need → require, sorry → I apologise), contractions and phrasal verbs belong to informal style.'],
      ['b2-18', 'Tartışmak', 'Karşı görüşü kabul edip kendi fikrini savun.', 'Debating: conceding (I accept that…, That\'s a fair point, but…), counter-arguing (Even so, On the contrary, That may be true; however…), asking for clarification, summing up your position.']
    ]},

    { level: 'C1', t: 'İleri dil bilgisi', lessons: [
      ['c1-01', 'Should you need…, Were I to…', 'Koşul cümlelerini devrik ve resmî kur.', 'Inverted conditionals in formal English: Should you need help, call me. Were I to accept, I would… Had I known, I would have… — meaning, register and the common mistake of keeping "if".'],
      ['c1-02', 'It\'s essential that he be…', 'Resmî öneri ve gereklilik yapılarını kullan.', 'The subjunctive and formal mandative structures: I suggest (that) he be…, It is essential that she attend…, I insist that…; British "should" alternative; It\'s (high) time we went; I\'d rather you didn\'t.'],
      ['c1-03', 'is thought to have…', 'Bilgiyi mesafeli ve resmî aktar.', 'Advanced passive reporting: He is thought to have left, The company is said to be planning…, be supposed to, be reported to; perfect infinitive for the past; used in news and formal writing.'],
      ['c1-04', 'I hope so / I hope not', 'Tekrardan kaçınmak için kısaltma ve yerine koyma.', 'Ellipsis and substitution: so/not (I think so, I\'m afraid not), do so, one/ones, leaving out repeated words (I\'d like to, but I can\'t), auxiliary echoes (She can\'t swim, but I can).'],
      ['c1-05', 'needn\'t have, had better, be bound to', 'İnce anlamlı modal yapıları ayırt et.', 'Advanced modals: needn\'t have done (did it, unnecessary) vs didn\'t need to (probably didn\'t), had better (warning), would rather, be bound to / be likely to / be sure to (probability).'],
      ['c1-06', 'was going to, was about to', 'Geçmişten bakınca gelecek olanı anlat.', 'Future in the past: was going to (plan that changed), was about to (on the point of), was to (destined / arranged), would (later events in narrative), was due to.']
    ]},
    { level: 'C1', t: 'Kelime derinliği', lessons: [
      ['c1-07', 'Kelime türetme', 'Ön ve son eklerle kelime ailesini genişlet.', 'Word formation: prefixes (un-, in-, mis-, over-, under-, re-, dis-) and suffixes (-ness, -ity, -ment, -ise/-ize, -ive, -able) to build word families (decide → decision → decisive → indecisive).'],
      ['c1-08', 'deeply concerned, highly unlikely', 'Güçlü ve doğal kelime eşleri kullan.', 'Advanced collocations: adverb + adjective (deeply concerned, highly unlikely, bitterly disappointed, fully aware), strong adjective + noun (heavy traffic, a strong argument, a narrow escape), verb + noun (pose a threat, raise awareness).'],
      ['c1-09', 'stem from, live up to', 'Soyut anlamlı deyimsel fiilleri kullan.', 'Abstract phrasal verbs: stem from, live up to, come across as, play down, account for, rule out, get across, bring about, set out to, wear off.'],
      ['c1-10', 'Tartışma kalıpları', 'Fikir tartışırken kullanılan sabit ifadeler.', 'Fixed expressions for discussion: at the end of the day, the bottom line is, a grey area, by and large, to all intents and purposes, on the face of it, it goes without saying, food for thought.'],
      ['c1-11', 'Eş anlamlıların farkı', 'Benzer kelimeler arasındaki ince farkı seç.', 'Nuance in near-synonyms: say/state/claim/argue/admit; big/huge/vast/massive; look/glance/stare/gaze; problem/issue/setback/drawback — meaning, strength and register.'],
      ['c1-12', 'mind you, as it happens', 'Konuşmayı doğal bağlantı sözcükleriyle akıt.', 'Spoken discourse markers: mind you, as it happens, come to think of it, to be fair, having said that, anyway, by the way, as I was saying — their exact function in conversation.']
    ]},
    { level: 'C1', t: 'Akademik ve profesyonel', lessons: [
      ['c1-13', 'İsimleştirme', 'Resmî yazıda fiil yerine isim yapıları kullan.', 'Nominalisation for formal style: We decided to expand → The decision to expand…; The prices increased sharply → There was a sharp increase in prices; when it helps and when it makes writing heavy.'],
      ['c1-14', 'Yazıda temkinli dil', 'Akademik ve iş yazısında iddiayı yumuşat.', 'Hedging in writing: arguably, tends to, appears to, to some extent, it could be argued that, there is some evidence that, may well; boosting: clearly, undoubtedly — balancing the two.'],
      ['c1-15', 'Rapor ve öneri yazmak', 'Resmî bir rapor ya da öneriyi düzenli yaz.', 'Writing a formal report or proposal: purpose statement (The aim of this report is to…), findings, recommendations (It is recommended that…), impersonal language, headings and linking.'],
      ['c1-16', 'İkna etmek', 'Dinleyiciyi ikna eden ifade tekniklerini kullan.', 'Persuasive language: rhetorical questions, the rule of three, emphatic do (I do believe), contrast (not only… but also), appealing to shared values, strong verbs and adjectives.'],
      ['c1-17', 'Özetlemek ve başka sözcüklerle anlatmak', 'Bir metni kendi cümlelerinle özetle.', 'Summarising and paraphrasing: changing word form and structure, synonyms, reporting verbs (the author suggests / maintains / acknowledges), keeping the meaning while cutting detail.'],
      ['c1-18', 'Toplantı ve pazarlık', 'Teklif et, uzlaş ve anlaşmaya var.', 'Meetings and negotiation: putting forward a proposal (What if we…?), conditional offers (We could… provided that…), conceding (We can live with that), rejecting politely, reaching and summing up agreement.']
    ]},

    { level: 'C2', t: 'Ustalık', lessons: [
      ['c2-01', 'Strange as it may seem…', 'Vurgulu ve öne alınmış yapılarla yaz.', 'Fronting and emphatic concession: Strange as it may seem, …; Much as I like him, …; Try as I might, …; Little did she know…; So great was the demand that…'],
      ['c2-02', 'lest, albeit, insofar as', 'Edebî ve resmî bağlaçları doğru kullan.', 'Formal and literary conjunctions: lest, albeit, insofar as, notwithstanding, whereby, hence, thereby, inasmuch as — meaning, register and position in the sentence.'],
      ['c2-03', 'Zamanların ince kullanımı', 'Zamanları mesafe, nezaket ve canlılık için kullan.', 'Subtle tense uses: past for politeness and distance (I was wondering if…), present for vivid narrative and headlines, future perfect for assumptions (You\'ll have heard the news), present perfect for news.'],
      ['c2-04', 'Üslup geçişleri', 'Argo, gündelik ve edebî dil arasında geçiş yap.', 'Register shifts: slang and colloquial (gonna, a bit dodgy, cheers), neutral, formal and literary equivalents of the same message; recognising and choosing the right level.'],
      ['c2-05', 'İroni ve hafifletme', 'İngiliz ve Amerikan mizahındaki ironiyi anla.', 'Irony and understatement: not bad (= good), a bit of a problem (= serious), I could care less, sarcasm signals, litotes (not unlike), how understatement differs between British and American English.'],
      ['c2-06', 'Atasözleri ve göndermeler', 'Kültürel göndermeleri ve atasözlerini anla.', 'Proverbs and cultural allusions: the elephant in the room, a Catch-22, an Achilles heel, every cloud has a silver lining, the writing on the wall — origin, meaning and modern use.']
    ]},
    { level: 'C2', t: 'İfade gücü', lessons: [
      ['c2-07', 'Kelimelerin çağrışımı', 'Aynı anlamın olumlu ve olumsuz tonlarını seç.', 'Connotation: thrifty / frugal / stingy, confident / arrogant, curious / nosy, determined / stubborn — choosing words for positive, neutral or negative tone.'],
      ['c2-08', 'Mecaz ve imgeler', 'Mecazlı anlatımı anla ve kullan.', 'Figurative language: metaphors in everyday English (time is money, a flood of complaints), similes, personification, and when figurative language sounds natural rather than forced.'],
      ['c2-09', 'Metinde bütünlük', 'Tekrar etmeden akıcı ve bağlantılı yaz.', 'Cohesion: reference words (this, the former / the latter, such), lexical chains and synonyms, ellipsis, theme–rheme order so that each sentence connects to the previous one.'],
      ['c2-10', 'Tartışmacı deneme', 'Güçlü ve dengeli bir tartışma metni yaz.', 'Writing an argumentative essay: a nuanced thesis, anticipating and refuting objections, evidence and examples, sophisticated linking, a conclusion that goes beyond summary.'],
      ['c2-11', 'Satır aralarını okumak', 'Yazarın tonunu ve ima ettiğini anla.', 'Critical reading: tone and attitude (sceptical, dismissive, wry), implied meaning, hedged claims, loaded words, distinguishing fact, opinion and insinuation.'],
      ['c2-12', 'Doğal akıcılık', 'Konuşmada araya girme, söz alma ve dolgu ifadeleri kullan.', 'Natural spontaneous conversation: fillers (you know, I mean, sort of), interrupting politely (Sorry to jump in, but…), holding the floor, buying time (That\'s a good question…), returning to a point.']
    ]}
  ],

  /* Seviye testi: A1'den C1'e her seviyeden 4 soru, kolaydan zora. */
  placement: [
    { level: 'A1', q: 'I ___ a student.', o: ['am', 'is', 'are', 'be'], a: 0 },
    { level: 'A1', q: 'She ___ from Ankara.', o: ['are', 'is', 'am', 'be'], a: 1 },
    { level: 'A1', q: '___ you like coffee?', o: ['Are', 'Does', 'Do', 'Is'], a: 2 },
    { level: 'A1', q: 'There ___ two books on the table.', o: ['is', 'am', 'be', 'are'], a: 3 },
    { level: 'A2', q: 'I ___ to the cinema yesterday.', o: ['went', 'go', 'gone', 'goes'], a: 0 },
    { level: 'A2', q: 'This bag is ___ than that one.', o: ['more cheap', 'cheaper', 'cheapest', 'the cheaper'], a: 1 },
    { level: 'A2', q: 'Have you ever ___ sushi?', o: ['ate', 'eat', 'eaten', 'eating'], a: 2 },
    { level: 'A2', q: 'We ___ visit our grandmother next weekend.', o: ['going to', 'will to', 'are go', 'are going to'], a: 3 },
    { level: 'B1', q: 'If I ___ more money, I would buy a car.', o: ['had', 'have', 'will have', 'would have'], a: 0 },
    { level: 'B1', q: 'I was reading when the phone ___.', o: ['rings', 'rang', 'was ring', 'has rung'], a: 1 },
    { level: 'B1', q: 'The man ___ lives next door is a doctor.', o: ['which', 'what', 'who', 'whose'], a: 2 },
    { level: 'B1', q: 'This bridge ___ in 1890.', o: ['built', 'is building', 'has built', 'was built'], a: 3 },
    { level: 'B2', q: 'If she had left earlier, she ___ the train.', o: ['would have caught', 'would catch', 'caught', 'had caught'], a: 0 },
    { level: 'B2', q: 'You ___ have told me! I could have helped.', o: ['must', 'should', 'can', 'will'], a: 1 },
    { level: 'B2', q: 'Not only ___ late, but he also forgot the tickets.', o: ['he was', 'did he be', 'was he', 'he did'], a: 2 },
    { level: 'B2', q: 'By next June, I ___ here for ten years.', o: ['will work', 'am working', 'have worked', 'will have worked'], a: 3 },
    { level: 'C1', q: '___ you need any help, just give me a call.', o: ['Should', 'Would', 'Were', 'Had'], a: 0 },
    { level: 'C1', q: 'It\'s high time we ___ home.', o: ['go', 'went', 'will go', 'have gone'], a: 1 },
    { level: 'C1', q: 'You ___ bought milk. We already had some.', o: ['mustn\'t have', 'couldn\'t have', 'needn\'t have', 'shouldn\'t to have'], a: 2 },
    { level: 'C1', q: 'The new policy is thought ___ a positive effect so far.', o: ['having had', 'that it had', 'to having', 'to have had'], a: 3 }
  ],

  /* Serbest sohbet konuları: Mia'nın rolü ve açılış cümlesi. */
  topics: [
    { id: 'free', t: 'Serbest sohbet', d: 'Aklına ne gelirse.', role: 'Mia, a friendly English tutor and conversation partner', open: 'Hi! What would you like to talk about today?', open_tr: 'Selam! Bugün ne hakkında konuşmak istersin?' },
    { id: 'intro', t: 'Tanışma', d: 'Kendini tanıt, sorular sor.', role: 'Mia, a friendly person meeting the learner for the first time at a party', open: 'Hi there! I\'m Mia. What\'s your name, and where are you from?', open_tr: 'Selam! Ben Mia. Adın ne, nerelisin?' },
    { id: 'day', t: 'Günün nasıl geçti?', d: 'Bugün ya da dün yaptıkların.', role: 'Mia, a friend asking about the learner\'s day', open: 'Hey! How was your day? Did you do anything interesting?', open_tr: 'Selam! Günün nasıl geçti? İlginç bir şey yaptın mı?' },
    { id: 'food', t: 'Restoranda', d: 'Sipariş ver, soru sor, hesap iste.', role: 'Mia, a waiter at a small restaurant called The Green Table', open: 'Good evening! Welcome to The Green Table. Are you ready to order?', open_tr: 'İyi akşamlar! The Green Table\'a hoş geldiniz. Sipariş vermeye hazır mısınız?' },
    { id: 'hotel', t: 'Otelde', d: 'Giriş yap, oda ve kahvaltı hakkında sor.', role: 'Mia, a receptionist at a hotel in London', open: 'Hello and welcome! Do you have a reservation?', open_tr: 'Merhaba, hoş geldiniz! Rezervasyonunuz var mı?' },
    { id: 'shop', t: 'Alışveriş', d: 'Beden, renk, fiyat sor.', role: 'Mia, a shop assistant in a clothes shop', open: 'Hi! Can I help you find anything today?', open_tr: 'Merhaba! Bugün bir şey bulmanıza yardım edebilir miyim?' },
    { id: 'hobby', t: 'Hobiler', d: 'Boş zamanında neler yaptığın.', role: 'Mia, a new friend who wants to know about the learner\'s hobbies', open: 'So, what do you like doing in your free time?', open_tr: 'Peki, boş zamanında ne yapmayı seversin?' },
    { id: 'job', t: 'İş görüşmesi', d: 'Kendini ve deneyimini anlat.', role: 'Mia, an interviewer for a job the learner applied for', open: 'Good morning, and thanks for coming in. Could you tell me a little about yourself?', open_tr: 'Günaydın, geldiğiniz için teşekkürler. Bize biraz kendinizden bahseder misiniz?' }
  ],

  /* İlk ders hazır gelir: beklemeden başlanır ve Mia'nın ders biçimine örnek olur. */
  starter: {
    id: 'a1-01',
    steps: [
      { t: 'intro', text: 'Merhaba! Ben Mia. Bugün İngilizcede insanları selamlamayı ve onlarla vedalaşmayı öğreneceğiz. Bunlar her konuşmanın ilk ve son cümleleri, yani en çok kullanacağın kalıplar.' },
      { t: 'explain', title: 'Selam vermek', body: 'En yaygın selam **Hello**\'dur. Arkadaşlar arasında daha rahat olan **Hi** kullanılır. Günün saatine göre de selam verebilirsin: sabah **Good morning**, öğleden sonra **Good afternoon**, akşam **Good evening**.\nDikkat: **Good night** selam değildir. "İyi geceler" demektir ve sadece ayrılırken ya da yatmadan önce söylenir.', examples: [
        { en: 'Hello!', tr: 'Merhaba!' },
        { en: 'Hi, Ali!', tr: 'Selam Ali!' },
        { en: 'Good morning!', tr: 'Günaydın!' },
        { en: 'Good evening, Mr Brown.', tr: 'İyi akşamlar Bay Brown.' }
      ] },
      { t: 'choice', q: 'Sabah saat 9\'da bir komşunla karşılaştın. Ne dersin?', sentence: '', options: ['Good night!', 'Good morning!', 'Goodbye!'], answer: 1, why: 'Sabah selamı **Good morning**\'dir. **Good night** sadece ayrılırken söylenir.' },
      { t: 'choice', q: 'Akşam 8\'de bir restorana girdin. Garsonu nasıl selamlarsın?', sentence: '', options: ['Good evening!', 'Good night!', 'Good afternoon!'], answer: 0, why: 'Akşam karşılaşınca **Good evening** denir. **Good night** vedalaşırken kullanılır.' },
      { t: 'explain', title: 'Hal hatır sormak ve vedalaşmak', body: 'Selamdan sonra genellikle **How are you?** (Nasılsın?) diye sorulur. Kısa ve doğal bir cevap: **I\'m fine, thanks. And you?**\nVedalaşırken **Goodbye** ya da daha rahat olan **Bye** dersin. Tekrar görüşeceksen **See you!** veya **See you tomorrow!** çok kullanılır.', examples: [
        { en: 'How are you?', tr: 'Nasılsın?' },
        { en: 'I\'m fine, thanks. And you?', tr: 'İyiyim, teşekkürler. Ya sen?' },
        { en: 'See you tomorrow!', tr: 'Yarın görüşürüz!' },
        { en: 'Bye! Have a nice day.', tr: 'Hoşça kal! İyi günler.' }
      ] },
      { t: 'match', q: 'İngilizce ifadeleri Türkçe anlamlarıyla eşleştir.', pairs: [
        { en: 'Good night', tr: 'İyi geceler' },
        { en: 'See you!', tr: 'Görüşürüz!' },
        { en: 'How are you?', tr: 'Nasılsın?' },
        { en: 'Thanks', tr: 'Teşekkürler' }
      ] },
      { t: 'fill', q: 'Boşluğu doldur.', sentence: 'A: How are you? B: I\'m fine, ___. And you?', hint: 'teşekkürler', answers: ['thanks', 'thank you'], why: '**thanks** ya da **thank you** "teşekkürler" demektir.' },
      { t: 'order', q: 'Kelimeleri sıraya koyarak cümleyi kur.', answer: 'How are you today?', tr: 'Bugün nasılsın?' },
      { t: 'choice', q: 'Arkadaşın "Bye!" dedi. Hangisi uygun bir cevap DEĞİL?', sentence: '', options: ['See you!', 'Bye! Have a nice day.', 'Good morning!'], answer: 2, why: 'Ayrılırken **Good morning** denmez; o bir selamlaşma ifadesidir.' },
      { t: 'translate', q: 'Bu cümleyi İngilizceye çevir.', tr: 'Günaydın! Nasılsın?', answer: 'Good morning! How are you?', alts: ['Good morning. How are you?', 'Good morning, how are you?'] },
      { t: 'write', q: 'Bir arkadaşınla karşılaştığını düşün. Onu selamla ve nasıl olduğunu sor (1–2 cümle).', check: 'A greeting (Hi / Hello / Good morning…) and the question "How are you?"', example: 'Hi, Can! How are you?' },
      { t: 'dialogue', scene: 'Sabah ofiste yeni bir iş arkadaşınla karşılaşıyorsun.', role: 'Mia, a friendly new colleague at the office in the morning', goal: 'Selam ver, nasıl olduğunu söyle ve onun nasıl olduğunu sor.', opening: 'Good morning! How are you today?', opening_tr: 'Günaydın! Bugün nasılsın?' }
    ],
    vocab: { t: 'vocab', words: [
      { en: 'Hello', tr: 'Merhaba', ex: 'Hello, Tom!' },
      { en: 'Hi', tr: 'Selam', ex: 'Hi, how are you?' },
      { en: 'Good morning', tr: 'Günaydın', ex: 'Good morning, everyone!' },
      { en: 'Good evening', tr: 'İyi akşamlar', ex: 'Good evening, sir.' },
      { en: 'Good night', tr: 'İyi geceler', ex: 'Good night, sleep well.' },
      { en: 'How are you?', tr: 'Nasılsın?', ex: 'Hi Ece, how are you?' },
      { en: 'I\'m fine, thanks.', tr: 'İyiyim, teşekkürler.', ex: 'I\'m fine, thanks. And you?' },
      { en: 'See you!', tr: 'Görüşürüz!', ex: 'See you tomorrow!' }
    ] },
    summary: { t: 'summary', points: [
      'Selam için **Hello**, daha rahat ortamda **Hi** kullanılır.',
      '**Good morning / afternoon / evening** günün saatine göre selamdır; **Good night** sadece vedalaşırken söylenir.',
      '**How are you?** sorusuna **I\'m fine, thanks. And you?** diye cevap verebilirsin.'
    ] }
  }
};
