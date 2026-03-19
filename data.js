// === ENGLISH PRACTICE DATA (PHASE 1-5) ===

const SENTENCES = [
    // ⚙️ FAZ 1: Temel Yapı Taşları (Foundation & Mechanics)
    // To Be (Am/Is/Are & Was/Were)
    { id: 101, topic: "Faz 1: To Be (Am/Is/Are)", level: "A1", turkish: "Ben bir öğrenciyim ve o benim öğretmenim.", english: "I am a student and he is my teacher.", keywords: [{ tr: "öğrenci", en: "student" }, { tr: "öğretmen", en: "teacher" }] },
    { id: 102, topic: "Faz 1: To Be (Was/Were)", level: "A1", turkish: "Dün hava çok soğuktu.", english: "The weather was very cold yesterday.", keywords: [{ tr: "hava", en: "weather" }, { tr: "soğuk", en: "cold" }] },
    
    // Nouns (Countable/Uncountable, Singular/Plural)
    { id: 103, topic: "Faz 1: İsimler (Nouns)", level: "A1", turkish: "Masada üç elma var.", english: "There are three apples on the table.", keywords: [{ tr: "elma", en: "apple" }, { tr: "masa", en: "table" }] },
    { id: 104, topic: "Faz 1: İsimler (Nouns)", level: "A2", turkish: "Biraz bilgiye ihtiyacım var.", english: "I need some information.", keywords: [{ tr: "bilgi", en: "information" }, { tr: "ihtiyaç", en: "need" }] },
    
    // Articles (A, An, The)
    { id: 105, topic: "Faz 1: Belirteçler (A, An, The)", level: "A1", turkish: "Güneş doğudan doğar.", english: "The sun rises in the east.", keywords: [{ tr: "güneş", en: "sun" }] },
    { id: 106, topic: "Faz 1: Belirteçler (A, An, The)", level: "A1", turkish: "O bir mühendis.", english: "She is an engineer.", keywords: [{ tr: "mühendis", en: "engineer" }] },
    
    // Pronouns
    { id: 107, topic: "Faz 1: Zamirler (Pronouns)", level: "A1", turkish: "Bunu kendim yaptım.", english: "I made this myself.", keywords: [{ tr: "kendim", en: "myself" }] },
    { id: 108, topic: "Faz 1: Zamirler (Pronouns)", level: "A2", turkish: "O araba onlarınki.", english: "That car is theirs.", keywords: [{ tr: "onlarınki", en: "theirs" }] },
    
    // Demonstratives & There is/are
    { id: 109, topic: "Faz 1: They/There/Demonstratives", level: "A1", turkish: "Şu kitaplar çok ilginç.", english: "Those books are very interesting.", keywords: [{ tr: "kitap", en: "book" }] },
    { id: 110, topic: "Faz 1: They/There/Demonstratives", level: "A1", turkish: "Sokakta hiç insan yoktu.", english: "There were no people in the street.", keywords: [{ tr: "sokak", en: "street" }, { tr: "insan", en: "people" }] },

    // Quantifiers
    { id: 111, topic: "Faz 1: Miktar Belirteçleri", level: "A2", turkish: "Çok fazla zamanım yok.", english: "I do not have much time.", keywords: [{ tr: "zaman", en: "time" }] },
    { id: 112, topic: "Faz 1: Miktar Belirteçleri", level: "A2", turkish: "Sadece birkaç arkadaşım partiye geldi.", english: "Only a few friends came to the party.", keywords: [{ tr: "birkaç", en: "a few" }] },

    // ⚙️ FAZ 2: Zaman Motorları (The Tense Architecture)
    // Present Simple
    { id: 201, topic: "Faz 2: Geniş Zaman (Present Simple)", level: "A1", turkish: "Her sabah kahve içerim.", english: "I drink coffee every morning.", keywords: [{ tr: "içmek", en: "to drink" }, { tr: "sabah", en: "morning" }] },
    { id: 202, topic: "Faz 2: Geniş Zaman (Present Simple)", level: "A2", turkish: "O hafta sonları çalışmaz.", english: "He does not work on weekends.", keywords: [{ tr: "çalışmak", en: "to work" }] },
    
    // Present Continuous
    { id: 203, topic: "Faz 2: Şimdiki Zaman (Present Cont.)", level: "A1", turkish: "Şu an kitap okuyorum.", english: "I am reading a book right now.", keywords: [{ tr: "okumak", en: "to read" }] },
    { id: 204, topic: "Faz 2: Şimdiki Zaman (Present Cont.)", level: "A2", turkish: "Dinle, birisi şarkı söylüyor.", english: "Listen, someone is singing.", keywords: [{ tr: "dinlemek", en: "to listen" }, { tr: "şarkı söylemek", en: "to sing" }] },

    // Past Simple
    { id: 205, topic: "Faz 2: Geçmiş Zaman (Past Simple)", level: "A1", turkish: "Dün gece yeni bir film izledim.", english: "I watched a new movie last night.", keywords: [{ tr: "izlemek", en: "to watch" }, { tr: "dün gece", en: "last night" }] },
    { id: 206, topic: "Faz 2: Geçmiş Zaman (Past Simple)", level: "A2", turkish: "Neden partiye erken gittin?", english: "Why did you go to the party early?", keywords: [{ tr: "erken", en: "early" }] },

    // Past Continuous
    { id: 207, topic: "Faz 2: Geçmişte Devam Eden (Past Cont.)", level: "B1", turkish: "Sen aradığında uyuyordum.", english: "I was sleeping when you called.", keywords: [{ tr: "uyumak", en: "to sleep" }] },
    { id: 208, topic: "Faz 2: Geçmişte Devam Eden (Past Cont.)", level: "B1", turkish: "Dışarı çıktığımda yağmur yağıyordu.", english: "It was raining when I went outside.", keywords: [{ tr: "yağmur", en: "rain" }] },

    // Present Perfect
    { id: 209, topic: "Faz 2: Present Perfect", level: "B1", turkish: "Anahtarlarımı kaybettim, bulamıyorum.", english: "I have lost my keys, I cannot find them.", keywords: [{ tr: "kaybetmek", en: "to lose" }, { tr: "anahtar", en: "keys" }] },
    { id: 210, topic: "Faz 2: Present Perfect", level: "B1", turkish: "Hiç Londra'ya gittin mi?", english: "Have you ever been to London?", keywords: [{ tr: "hiç", en: "ever" }] },

    // Present Perfect Continuous
    { id: 211, topic: "Faz 2: Present Perfect Cont.", level: "B1", turkish: "Sabahtan beri ders çalışıyorum.", english: "I have been studying since morning.", keywords: [{ tr: "çalışmak", en: "to study" }, { tr: "beri", en: "since" }] },
    
    // Past Perfect
    { id: 212, topic: "Faz 2: Past Perfect", level: "B2", turkish: "Biz geldiğimizde misafirler çoktan gitmişti.", english: "The guests had already left when we arrived.", keywords: [{ tr: "çoktan", en: "already" }, { tr: "misafir", en: "guest" }] },

    // Future (Will & Be going to)
    { id: 213, topic: "Faz 2: Gelecek Zaman (Future)", level: "A2", turkish: "Sanırım yarın yağmur yağacak.", english: "I think it will rain tomorrow.", keywords: [{ tr: "sanırım", en: "to think" }] },
    { id: 214, topic: "Faz 2: Gelecek Zaman (Future)", level: "A2", turkish: "Bu akşam bir arkadaşımla buluşacağım.", english: "I am going to meet a friend this evening.", keywords: [{ tr: "buluşmak", en: "to meet" }] },

    // ⚙️ FAZ 3: Kapasite ve İhtimal Motorları (Modals)
    { id: 301, topic: "Faz 3: Yetenek (Ability)", level: "A2", turkish: "Çocukken çok hızlı koşabilirdim.", english: "I could run very fast when I was a child.", keywords: [{ tr: "hızlı", en: "fast" }] },
    { id: 302, topic: "Faz 3: Zorunluluk (Obligation)", level: "A2", turkish: "Trafik kurallarına uymak zorundayız.", english: "We have to obey traffic rules.", keywords: [{ tr: "uymak", en: "to obey" }] },
    { id: 303, topic: "Faz 3: Tavsiye (Advice)", level: "B1", turkish: "O film çok kötü, izlememelisin.", english: "That movie is very bad, you should not watch it.", keywords: [{ tr: "izlemek", en: "to watch" }] },
    { id: 304, topic: "Faz 3: İhtimal (Possibility)", level: "B1", turkish: "Hava bulutlu, yağmur yağabilir.", english: "The weather is cloudy, it might rain.", keywords: [{ tr: "bulutlu", en: "cloudy" }] },
    { id: 305, topic: "Faz 3: Geçmiş Çıkarımlar (Past Modals)", level: "B2", turkish: "Geç kaldı, trafiğe takılmış olmalı.", english: "He is late, he must have been stuck in traffic.", keywords: [{ tr: "takılmak", en: "to be stuck" }] },

    // ⚙️ FAZ 4: Cümle Mühendisliği (Sentence Engineering)
    { id: 401, topic: "Faz 4: Karşılaştırma (Comparatives)", level: "A2", turkish: "Bu araba diğerinden daha pahalı.", english: "This car is more expensive than the other one.", keywords: [{ tr: "pahalı", en: "expensive" }] },
    { id: 402, topic: "Faz 4: En Üstünlük (Superlatives)", level: "A2", turkish: "Sınıftaki en uzun öğrenci Ali'dir.", english: "Ali is the tallest student in the class.", keywords: [{ tr: "uzun", en: "tall" }] },
    { id: 403, topic: "Faz 4: Zaman/Yer Edatları (Prepositions)", level: "A2", turkish: "Toplantı Pazartesi günü saat beşte.", english: "The meeting is on Monday at five o'clock.", keywords: [{ tr: "toplantı", en: "meeting" }] },
    { id: 404, topic: "Faz 4: Bağlaçlar (Conjunctions)", level: "B1", turkish: "Yorgun olmasına rağmen çalışmaya devam etti.", english: "Although he was tired, he continued to work.", keywords: [{ tr: "rağmen", en: "although" }, { tr: "devam etmek", en: "to continue" }] },
    
    // ⚙️ FAZ 5: İleri Düzey Montaj (Advanced Assembly)
    { id: 501, topic: "Faz 5: Koşul Cümleleri (If Clauses)", level: "B1", turkish: "Erken kalkarsan treni yakalarsın.", english: "If you wake up early, you will catch the train.", keywords: [{ tr: "yakalamak", en: "to catch" }] },
    { id: 502, topic: "Faz 5: Koşul Cümleleri (If Clauses)", level: "B2", turkish: "Zengin olsaydım, bir tekne alırdım.", english: "If I were rich, I would buy a boat.", keywords: [{ tr: "zengin", en: "rich" }] },
    { id: 503, topic: "Faz 5: Edilgen Çatı (Passive Voice)", level: "B1", turkish: "Bu köprü geçen yıl inşa edildi.", english: "This bridge was built last year.", keywords: [{ tr: "köprü", en: "bridge" }, { tr: "inşa etmek", en: "to build" }] },
    { id: 504, topic: "Faz 5: Sıfat Cümlecikleri (Relative Clauses)", level: "B2", turkish: "Dün aldığım araba bozuldu.", english: "The car that I bought yesterday broke down.", keywords: [{ tr: "bozulmak", en: "to break down" }] },
    { id: 505, topic: "Faz 5: Fiilimsiler (Gerunds & Infinitives)", level: "B2", turkish: "Yalnız seyahat etmekten keyif alıyorum.", english: "I enjoy traveling alone.", keywords: [{ tr: "keyif almak", en: "to enjoy" }] },
    { id: 506, topic: "Faz 5: Dolaylı Anlatım (Reported Speech)", level: "B2", turkish: "Bana oraya gitmeyeceğini söyledi.", english: "He told me he would not go there.", keywords: [{ tr: "söylemek", en: "to tell" }] },
    { id: 507, topic: "Faz 5: Ettirgen (Causatives)", level: "B2", turkish: "Dün saçımı kestirdim.", english: "I had my hair cut yesterday.", keywords: [{ tr: "kestirmek", en: "to have cut" }] }
];


// === SPANISH PRACTICE DATA (FAZ 1-5 Equivalents) ===

const SENTENCES_ES = [
    // ⚙️ FASE 1: Bloques Fundamentales

    // To Be (Am/Is/Are)
    { id: 201, topic: "Fase 1: To Be (Am/Is/Are)", level: "A1", spanish: "Soy estudiante y él es mi profesor.", english: "I am a student and he is my teacher.", keywords: [{ es: "estudiante", en: "student" }, { es: "profesor", en: "teacher" }] },
    { id: 202, topic: "Fase 1: To Be (Am/Is/Are)", level: "A1", spanish: "Ella está cansada hoy, pero nosotros estamos bien.", english: "She is tired today, but we are fine.", keywords: [{ es: "cansada", en: "tired" }, { es: "bien", en: "fine" }] },

    // To Be (Was/Were)
    { id: 203, topic: "Fase 1: To Be (Was/Were)", level: "A1", spanish: "El tiempo estuvo muy frío ayer.", english: "The weather was very cold yesterday.", keywords: [{ es: "tiempo", en: "weather" }, { es: "frío", en: "cold" }] },
    { id: 204, topic: "Fase 1: To Be (Was/Were)", level: "A2", spanish: "Ellos estaban en casa cuando los llamé.", english: "They were at home when I called them.", keywords: [{ es: "casa", en: "home" }, { es: "cuando", en: "when" }] },

    // Sustantivos (Nouns)
    { id: 205, topic: "Fase 1: Sustantivos (Nouns)", level: "A1", spanish: "Hay tres manzanas en la mesa.", english: "There are three apples on the table.", keywords: [{ es: "manzanas", en: "apples" }, { es: "mesa", en: "table" }] },
    { id: 206, topic: "Fase 1: Sustantivos (Nouns)", level: "A2", spanish: "Necesito algo de información sobre este tema.", english: "I need some information about this topic.", keywords: [{ es: "información", en: "information" }, { es: "tema", en: "topic" }] },

    // Artículos (A, An, The)
    { id: 207, topic: "Fase 1: Artículos (A, An, The)", level: "A1", spanish: "El sol sale por el este.", english: "The sun rises in the east.", keywords: [{ es: "sol", en: "sun" }, { es: "este", en: "east" }] },
    { id: 208, topic: "Fase 1: Artículos (A, An, The)", level: "A1", spanish: "Ella es ingeniera y tiene un perro.", english: "She is an engineer and she has a dog.", keywords: [{ es: "ingeniera", en: "engineer" }, { es: "perro", en: "dog" }] },

    // Pronombres (Pronouns)
    { id: 209, topic: "Fase 1: Pronombres (Pronouns)", level: "A1", spanish: "Hice esto yo mismo.", english: "I made this myself.", keywords: [{ es: "yo mismo", en: "myself" }, { es: "hice", en: "made" }] },
    { id: 210, topic: "Fase 1: Pronombres (Pronouns)", level: "A2", spanish: "Ese coche es de ellos.", english: "That car is theirs.", keywords: [{ es: "coche", en: "car" }, { es: "de ellos", en: "theirs" }] },

    // There is / There are
    { id: 211, topic: "Fase 1: There is/There are", level: "A1", spanish: "Esos libros son muy interesantes.", english: "Those books are very interesting.", keywords: [{ es: "libros", en: "books" }, { es: "interesantes", en: "interesting" }] },
    { id: 212, topic: "Fase 1: There is/There are", level: "A1", spanish: "No había nadie en la calle.", english: "There was nobody in the street.", keywords: [{ es: "nadie", en: "nobody" }, { es: "calle", en: "street" }] },

    // Cuantificadores
    { id: 213, topic: "Fase 1: Cuantificadores", level: "A2", spanish: "No tengo mucho tiempo libre.", english: "I do not have much free time.", keywords: [{ es: "mucho", en: "much" }, { es: "tiempo libre", en: "free time" }] },
    { id: 214, topic: "Fase 1: Cuantificadores", level: "A2", spanish: "Solo unos pocos amigos vinieron a mi fiesta.", english: "Only a few friends came to my party.", keywords: [{ es: "pocos", en: "few" }, { es: "fiesta", en: "party" }] },

    // ⚙️ FASE 2: Tiempos Verbales

    // Presente Simple
    { id: 215, topic: "Fase 2: Presente Simple (Present Simple)", level: "A1", spanish: "Bebo café todas las mañanas antes de ir al trabajo.", english: "I drink coffee every morning before going to work.", keywords: [{ es: "café", en: "coffee" }, { es: "trabajo", en: "work" }] },
    { id: 216, topic: "Fase 2: Presente Simple (Present Simple)", level: "A2", spanish: "El tren normalmente no llega tarde.", english: "The train does not usually arrive late.", keywords: [{ es: "normalmente", en: "usually" }, { es: "tarde", en: "late" }] },

    // Presente Continuo
    { id: 217, topic: "Fase 2: Presente Continuo (Present Cont.)", level: "A2", spanish: "Estoy estudiando inglés para conseguir un mejor trabajo.", english: "I am studying English to get a better job.", keywords: [{ es: "estudiando", en: "studying" }, { es: "mejor", en: "better" }] },
    { id: 218, topic: "Fase 2: Presente Continuo (Present Cont.)", level: "A2", spanish: "¿Por qué está él hablando tan rápido?", english: "Why is he speaking so fast?", keywords: [{ es: "hablando", en: "speaking" }, { es: "rápido", en: "fast" }] },

    // Pasado Simple
    { id: 219, topic: "Fase 2: Pasado Simple (Past Simple)", level: "A2", spanish: "Ayer fui a la biblioteca y tomé prestados tres libros.", english: "Yesterday I went to the library and borrowed three books.", keywords: [{ es: "biblioteca", en: "library" }, { es: "prestados", en: "borrowed" }] },
    { id: 220, topic: "Fase 2: Pasado Simple (Past Simple)", level: "A2", spanish: "Cuando era niño, jugaba en el jardín todos los días.", english: "When I was a child, I played in the garden every day.", keywords: [{ es: "niño", en: "child" }, { es: "jardín", en: "garden" }] },

    // Pasado Continuo
    { id: 221, topic: "Fase 2: Pasado Continuo (Past Cont.)", level: "B1", spanish: "Estaba leyendo un libro cuando sonó el teléfono.", english: "I was reading a book when the phone rang.", keywords: [{ es: "leyendo", en: "reading" }, { es: "sonó", en: "rang" }] },
    { id: 222, topic: "Fase 2: Pasado Continuo (Past Cont.)", level: "B1", spanish: "Mientras yo cocinaba, ellos estaban viendo la televisión.", english: "While I was cooking, they were watching television.", keywords: [{ es: "cocinaba", en: "was cooking" }, { es: "viendo", en: "watching" }] },

    // Present Perfect
    { id: 223, topic: "Fase 2: Present Perfect", level: "B1", spanish: "Nunca he probado la comida japonesa, pero quiero intentarlo.", english: "I have never tried Japanese food, but I want to try it.", keywords: [{ es: "nunca", en: "never" }, { es: "probado", en: "tried" }] },
    { id: 224, topic: "Fase 2: Present Perfect", level: "B1", spanish: "He trabajado en esta empresa durante cinco años.", english: "I have worked at this company for five years.", keywords: [{ es: "trabajado", en: "worked" }, { es: "durante", en: "for" }] },

    // Present Perfect Cont.
    { id: 225, topic: "Fase 2: Present Perfect Cont.", level: "B1", spanish: "He estado esperando este momento toda mi vida.", english: "I have been waiting for this moment all my life.", keywords: [{ es: "esperando", en: "waiting" }, { es: "toda", en: "all" }] },

    // Past Perfect
    { id: 226, topic: "Fase 2: Past Perfect", level: "B1", spanish: "Cuando llegué a la estación, el tren ya había salido.", english: "When I arrived at the station, the train had already left.", keywords: [{ es: "llegué", en: "arrived" }, { es: "había salido", en: "had left" }] },

    // Futuro
    { id: 227, topic: "Fase 2: Futuro (Future)", level: "A2", spanish: "Voy a empezar un nuevo proyecto la semana que viene.", english: "I am going to start a new project next week.", keywords: [{ es: "empezar", en: "start" }, { es: "proyecto", en: "project" }] },
    { id: 228, topic: "Fase 2: Futuro (Future)", level: "A2", spanish: "No te preocupes, te ayudaré con el examen.", english: "Don't worry, I will help you with the exam.", keywords: [{ es: "ayudaré", en: "will help" }, { es: "examen", en: "exam" }] },

    // ⚙️ FASE 3: Verbos Modales

    // Habilidad (Ability)
    { id: 229, topic: "Fase 3: Habilidad (Ability)", level: "A2", spanish: "Puedo hablar tres idiomas con fluidez.", english: "I can speak three languages fluently.", keywords: [{ es: "idiomas", en: "languages" }, { es: "fluidez", en: "fluently" }] },
    { id: 230, topic: "Fase 3: Habilidad (Ability)", level: "B1", spanish: "No pude terminar el proyecto a tiempo porque surgió un problema.", english: "I could not finish the project on time because a problem came up.", keywords: [{ es: "terminar", en: "finish" }, { es: "surgió", en: "came up" }] },

    // Obligación (Obligation)
    { id: 231, topic: "Fase 3: Obligación (Obligation)", level: "B1", spanish: "Debes entregar este informe antes del viernes.", english: "You must submit this report before Friday.", keywords: [{ es: "entregar", en: "submit" }, { es: "informe", en: "report" }] },
    { id: 232, topic: "Fase 3: Obligación (Obligation)", level: "B1", spanish: "No tenemos que ponernos uniforme en esta oficina.", english: "We do not have to wear a uniform at this office.", keywords: [{ es: "uniforme", en: "uniform" }, { es: "oficina", en: "office" }] },

    // Consejo (Advice)
    { id: 233, topic: "Fase 3: Consejo (Advice)", level: "A2", spanish: "Deberías descansar más si te sientes cansado.", english: "You should rest more if you feel tired.", keywords: [{ es: "descansar", en: "rest" }, { es: "cansado", en: "tired" }] },
    { id: 234, topic: "Fase 3: Consejo (Advice)", level: "A2", spanish: "No deberías comer tanta comida rápida.", english: "You should not eat so much fast food.", keywords: [{ es: "comida rápida", en: "fast food" }, { es: "tanto", en: "so much" }] },

    // Posibilidad (Possibility)
    { id: 235, topic: "Fase 3: Posibilidad (Possibility)", level: "B1", spanish: "Puede que llegue tarde a la reunión mañana.", english: "I might be late for the meeting tomorrow.", keywords: [{ es: "reunión", en: "meeting" }, { es: "tarde", en: "late" }] },
    { id: 236, topic: "Fase 3: Posibilidad (Possibility)", level: "B1", spanish: "Podría llover esta tarde, así que lleva un paraguas.", english: "It could rain this afternoon, so take an umbrella.", keywords: [{ es: "paraguas", en: "umbrella" }, { es: "llover", en: "rain" }] },

    // Modales Pasados (Past Modals)
    { id: 237, topic: "Fase 3: Modales Pasados (Past Modals)", level: "B2", spanish: "Deberías haber llamado antes de venir.", english: "You should have called before coming.", keywords: [{ es: "haber llamado", en: "should have called" }, { es: "antes de", en: "before" }] },

    // ⚙️ FASE 4: Construcción de Oraciones

    // Comparativos
    { id: 238, topic: "Fase 4: Comparativos (Comparatives)", level: "B1", spanish: "Este hotel es más caro que el otro, pero es más cómodo.", english: "This hotel is more expensive than the other one, but it is more comfortable.", keywords: [{ es: "más caro", en: "more expensive" }, { es: "cómodo", en: "comfortable" }] },
    { id: 239, topic: "Fase 4: Comparativos (Comparatives)", level: "B1", spanish: "Ella habla inglés mejor que su hermano.", english: "She speaks English better than her brother.", keywords: [{ es: "mejor", en: "better" }, { es: "hermano", en: "brother" }] },

    // Superlativos
    { id: 240, topic: "Fase 4: Superlativos (Superlatives)", level: "B1", spanish: "Este es el libro más interesante que he leído en años.", english: "This is the most interesting book I have read in years.", keywords: [{ es: "más interesante", en: "most interesting" }, { es: "leído", en: "read" }] },
    { id: 241, topic: "Fase 4: Superlativos (Superlatives)", level: "A2", spanish: "El Everest es la montaña más alta del mundo.", english: "Mount Everest is the highest mountain in the world.", keywords: [{ es: "más alta", en: "highest" }, { es: "mundo", en: "world" }] },

    // Preposiciones
    { id: 242, topic: "Fase 4: Preposiciones (Prepositions)", level: "A2", spanish: "La reunión empieza a las tres en la sala de conferencias.", english: "The meeting starts at three o'clock in the conference room.", keywords: [{ es: "sala de conferencias", en: "conference room" }, { es: "empieza", en: "starts" }] },
    { id: 243, topic: "Fase 4: Preposiciones (Prepositions)", level: "A2", spanish: "Pon el libro sobre la mesa y el bolso debajo de la silla.", english: "Put the book on the table and the bag under the chair.", keywords: [{ es: "sobre", en: "on" }, { es: "debajo de", en: "under" }] },

    // Conjunciones
    { id: 244, topic: "Fase 4: Conjunciones (Conjunctions)", level: "B1", spanish: "Aunque estaba muy cansado, terminé todo el trabajo.", english: "Although I was very tired, I finished all the work.", keywords: [{ es: "aunque", en: "although" }, { es: "terminé", en: "finished" }] },
    { id: 245, topic: "Fase 4: Conjunciones (Conjunctions)", level: "B1", spanish: "Ni el café ni el té me ayudan a concentrarme.", english: "Neither coffee nor tea helps me concentrate.", keywords: [{ es: "ni", en: "neither/nor" }, { es: "concentrarme", en: "concentrate" }] },

    // ⚙️ FASE 5: Estructuras Avanzadas

    // Condicionales (If Clauses)
    { id: 246, topic: "Fase 5: Condicionales (If Clauses)", level: "B1", spanish: "Si estudias más, aprobarás el examen sin problemas.", english: "If you study harder, you will pass the exam without any problems.", keywords: [{ es: "estudias", en: "study" }, { es: "aprobarás", en: "will pass" }] },
    { id: 247, topic: "Fase 5: Condicionales (If Clauses)", level: "B2", spanish: "Si tuviera más dinero, viajaría por todo el mundo.", english: "If I had more money, I would travel around the world.", keywords: [{ es: "tuviera", en: "had" }, { es: "viajaría", en: "would travel" }] },

    // Voz Pasiva (Passive Voice)
    { id: 248, topic: "Fase 5: Voz Pasiva (Passive Voice)", level: "B1", spanish: "Este puente fue construido hace doscientos años.", english: "This bridge was built two hundred years ago.", keywords: [{ es: "construido", en: "built" }, { es: "puente", en: "bridge" }] },
    { id: 249, topic: "Fase 5: Voz Pasiva (Passive Voice)", level: "B2", spanish: "El informe ha sido revisado y aprobado por el director.", english: "The report has been reviewed and approved by the manager.", keywords: [{ es: "revisado", en: "reviewed" }, { es: "aprobado", en: "approved" }] },

    // Cláusulas Relativas (Relative Clauses)
    { id: 250, topic: "Fase 5: Cláusulas Relativas (Relative Clauses)", level: "B2", spanish: "El hombre que conocí ayer resultó ser el director de la empresa.", english: "The man I met yesterday turned out to be the director of the company.", keywords: [{ es: "conocí", en: "met" }, { es: "resultó ser", en: "turned out to be" }] },
    { id: 251, topic: "Fase 5: Cláusulas Relativas (Relative Clauses)", level: "B2", spanish: "El libro del que te hablé la semana pasada está en la biblioteca.", english: "The book I told you about last week is at the library.", keywords: [{ es: "hablé", en: "told" }, { es: "pasada", en: "last" }] },

    // Gerundios e Infinitivos
    { id: 252, topic: "Fase 5: Gerundios e Infinitivos (Gerunds & Infinitives)", level: "B1", spanish: "Dejar de fumar es uno de los mejores cambios que he hecho.", english: "Giving up smoking is one of the best changes I have made.", keywords: [{ es: "dejar de fumar", en: "giving up smoking" }, { es: "cambios", en: "changes" }] },
    { id: 253, topic: "Fase 5: Gerundios e Infinitivos (Gerunds & Infinitives)", level: "B1", spanish: "Espero poder hablar inglés con fluidez el año que viene.", english: "I hope to speak English fluently next year.", keywords: [{ es: "espero", en: "hope" }, { es: "fluidez", en: "fluently" }] },

    // Estilo Indirecto (Reported Speech)
    { id: 254, topic: "Fase 5: Estilo Indirecto (Reported Speech)", level: "B2", spanish: "Ella dijo que estaba muy cansada y que necesitaba descansar.", english: "She said that she was very tired and needed to rest.", keywords: [{ es: "dijo", en: "said" }, { es: "necesitaba", en: "needed" }] },
    { id: 255, topic: "Fase 5: Estilo Indirecto (Reported Speech)", level: "B2", spanish: "Le pregunté si sabía dónde estaba la biblioteca.", english: "I asked him if he knew where the library was.", keywords: [{ es: "pregunté", en: "asked" }, { es: "sabía", en: "knew" }] },

    // Causativos (Causatives)
    { id: 256, topic: "Fase 5: Causativos (Causatives)", level: "B2", spanish: "Mandé lavar mi coche en el taller esta mañana.", english: "I had my car washed at the garage this morning.", keywords: [{ es: "mandé lavar", en: "had washed" }, { es: "taller", en: "garage" }] },
    { id: 257, topic: "Fase 5: Causativos (Causatives)", level: "B2", spanish: "La profesora hizo que los estudiantes reescribieran sus redacciones.", english: "The teacher made the students rewrite their essays.", keywords: [{ es: "reescribieran", en: "rewrite" }, { es: "redacciones", en: "essays" }] },
];


const VERBS = [
    { v1: "go", v2: "went", v3: "gone", tr: "gitmek", tr2: "gitti", tr3: "gitmiş" },
    { v1: "come", v2: "came", v3: "come", tr: "gelmek", tr2: "geldi", tr3: "gelmiş" },
    { v1: "take", v2: "took", v3: "taken", tr: "almak", tr2: "aldı", tr3: "almış" },
    { v1: "make", v2: "made", v3: "made", tr: "yapmak", tr2: "yaptı", tr3: "yapmış" },
    { v1: "see", v2: "saw", v3: "seen", tr: "görmek", tr2: "gördü", tr3: "görmüş" },
    { v1: "know", v2: "knew", v3: "known", tr: "bilmek", tr2: "bildi", tr3: "bilmiş" },
    { v1: "get", v2: "got", v3: "gotten", tr: "almak/elde etmek", tr2: "aldı/elde etti", tr3: "almış/elde etmiş" },
    { v1: "give", v2: "gave", v3: "given", tr: "vermek", tr2: "verdi", tr3: "vermiş" },
    { v1: "find", v2: "found", v3: "found", tr: "bulmak", tr2: "buldu", tr3: "bulmuş" },
    { v1: "think", v2: "thought", v3: "thought", tr: "düşünmek", tr2: "düşündü", tr3: "düşünmüş" },
    { v1: "tell", v2: "told", v3: "told", tr: "söylemek", tr2: "söyledi", tr3: "söylemiş" },
    { v1: "become", v2: "became", v3: "become", tr: "olmak", tr2: "oldu", tr3: "olmuş" },
    { v1: "leave", v2: "left", v3: "left", tr: "ayrılmak", tr2: "ayrıldı", tr3: "ayrılmış" },
    { v1: "feel", v2: "felt", v3: "felt", tr: "hissetmek", tr2: "hissetti", tr3: "hissetmiş" },
    { v1: "put", v2: "put", v3: "put", tr: "koymak", tr2: "koydu", tr3: "koymuş" },
    { v1: "bring", v2: "brought", v3: "brought", tr: "getirmek", tr2: "getirdi", tr3: "getirmiş" },
    { v1: "begin", v2: "began", v3: "begun", tr: "başlamak", tr2: "başladı", tr3: "başlamış" },
    { v1: "keep", v2: "kept", v3: "kept", tr: "tutmak", tr2: "tuttu", tr3: "tutmuş" },
    { v1: "write", v2: "wrote", v3: "written", tr: "yazmak", tr2: "yazdı", tr3: "yazmış" },
    { v1: "stand", v2: "stood", v3: "stood", tr: "ayakta durmak", tr2: "ayakta durdu", tr3: "ayakta durmuş" },
    { v1: "hear", v2: "heard", v3: "heard", tr: "duymak", tr2: "duydu", tr3: "duymuş" },
    { v1: "meet", v2: "met", v3: "met", tr: "tanışmak/buluşmak", tr2: "tanıştı", tr3: "tanışmış" },
    { v1: "run", v2: "ran", v3: "run", tr: "koşmak", tr2: "koştu", tr3: "koşmuş" },
    { v1: "pay", v2: "paid", v3: "paid", tr: "ödemek", tr2: "ödedi", tr3: "ödemiş" },
    { v1: "sit", v2: "sat", v3: "sat", tr: "oturmak", tr2: "oturdu", tr3: "oturmuş" },
    { v1: "speak", v2: "spoke", v3: "spoken", tr: "konuşmak", tr2: "konuştu", tr3: "konuşmuş" },
    { v1: "read", v2: "read", v3: "read", tr: "okumak", tr2: "okudu", tr3: "okumuş" },
    { v1: "grow", v2: "grew", v3: "grown", tr: "büyümek", tr2: "büyüdü", tr3: "büyümüş" },
    { v1: "lose", v2: "lost", v3: "lost", tr: "kaybetmek", tr2: "kaybetti", tr3: "kaybetmiş" },
    { v1: "fall", v2: "fell", v3: "fallen", tr: "düşmek", tr2: "düştü", tr3: "düşmüş" },
    { v1: "send", v2: "sent", v3: "sent", tr: "göndermek", tr2: "gönderdi", tr3: "göndermiş" },
    { v1: "build", v2: "built", v3: "built", tr: "inşa etmek", tr2: "inşa etti", tr3: "inşa etmiş" },
    { v1: "understand", v2: "understood", v3: "understood", tr: "anlamak", tr2: "anladı", tr3: "anlamış" },
    { v1: "draw", v2: "drew", v3: "drawn", tr: "çizmek", tr2: "çizdi", tr3: "çizmiş" },
    { v1: "break", v2: "broke", v3: "broken", tr: "kırmak", tr2: "kırdı", tr3: "kırmış" },
    { v1: "spend", v2: "spent", v3: "spent", tr: "harcamak", tr2: "harcadı", tr3: "harcamış" },
    { v1: "cut", v2: "cut", v3: "cut", tr: "kesmek", tr2: "kesti", tr3: "kesmiş" },
    { v1: "rise", v2: "rose", v3: "risen", tr: "yükselmek", tr2: "yükseldi", tr3: "yükselmiş" },
    { v1: "drive", v2: "drove", v3: "driven", tr: "sürmek", tr2: "sürdü", tr3: "sürmüş" },
    { v1: "buy", v2: "bought", v3: "bought", tr: "satın almak", tr2: "satın aldı", tr3: "satın almış" },
    { v1: "wear", v2: "wore", v3: "worn", tr: "giymek", tr2: "giydi", tr3: "giymiş" },
    { v1: "choose", v2: "chose", v3: "chosen", tr: "seçmek", tr2: "seçti", tr3: "seçmiş" },
    { v1: "throw", v2: "threw", v3: "thrown", tr: "fırlatmak", tr2: "fırlattı", tr3: "fırlatmış" },
    { v1: "eat", v2: "ate", v3: "eaten", tr: "yemek", tr2: "yedi", tr3: "yemiş" },
    { v1: "catch", v2: "caught", v3: "caught", tr: "yakalamak", tr2: "yakaladı", tr3: "yakalamış" },
    { v1: "teach", v2: "taught", v3: "taught", tr: "öğretmek", tr2: "öğretti", tr3: "öğretmiş" }
];

const VERBS_ES = [
    { v1: "go", v2: "went", v3: "gone", es: "ir", es2: "fue", es3: "ido" },
    { v1: "come", v2: "came", v3: "come", es: "venir", es2: "vino", es3: "venido" },
    { v1: "take", v2: "took", v3: "taken", es: "tomar", es2: "tomó", es3: "tomado" },
    { v1: "make", v2: "made", v3: "made", es: "hacer", es2: "hizo", es3: "hecho" },
    { v1: "see", v2: "saw", v3: "seen", es: "ver", es2: "vio", es3: "visto" },
    { v1: "know", v2: "knew", v3: "known", es: "saber", es2: "supo", es3: "sabido" },
    { v1: "get", v2: "got", v3: "gotten", es: "obtener", es2: "obtuvo", es3: "obtenido" },
    { v1: "give", v2: "gave", v3: "given", es: "dar", es2: "dio", es3: "dado" },
    { v1: "find", v2: "found", v3: "found", es: "encontrar", es2: "encontró", es3: "encontrado" },
    { v1: "think", v2: "thought", v3: "thought", es: "pensar", es2: "pensó", es3: "pensado" },
    { v1: "tell", v2: "told", v3: "told", es: "decir", es2: "dijo", es3: "dicho" },
    { v1: "become", v2: "became", v3: "become", es: "volverse", es2: "se volvió", es3: "vuelto" },
    { v1: "leave", v2: "left", v3: "left", es: "salir", es2: "salió", es3: "salido" },
    { v1: "feel", v2: "felt", v3: "felt", es: "sentir", es2: "sintió", es3: "sentido" },
    { v1: "put", v2: "put", v3: "put", es: "poner", es2: "puso", es3: "puesto" },
    { v1: "bring", v2: "brought", v3: "brought", es: "traer", es2: "trajo", es3: "traído" },
    { v1: "begin", v2: "began", v3: "begun", es: "empezar", es2: "empezó", es3: "empezado" },
    { v1: "keep", v2: "kept", v3: "kept", es: "mantener", es2: "mantuvo", es3: "mantenido" },
    { v1: "write", v2: "wrote", v3: "written", es: "escribir", es2: "escribió", es3: "escrito" },
    { v1: "speak", v2: "spoke", v3: "spoken", es: "hablar", es2: "habló", es3: "hablado" },
    { v1: "read", v2: "read", v3: "read", es: "leer", es2: "leyó", es3: "leído" },
    { v1: "run", v2: "ran", v3: "run", es: "correr", es2: "corrió", es3: "corrido" },
    { v1: "eat", v2: "ate", v3: "eaten", es: "comer", es2: "comió", es3: "comido" },
    { v1: "buy", v2: "bought", v3: "bought", es: "comprar", es2: "compró", es3: "comprado" },
    { v1: "send", v2: "sent", v3: "sent", es: "enviar", es2: "envió", es3: "enviado" },
    { v1: "fall", v2: "fell", v3: "fallen", es: "caer", es2: "cayó", es3: "caído" },
    { v1: "build", v2: "built", v3: "built", es: "construir", es2: "construyó", es3: "construido" },
    { v1: "understand", v2: "understood", v3: "understood", es: "entender", es2: "entendió", es3: "entendido" },
    { v1: "break", v2: "broke", v3: "broken", es: "romper", es2: "rompió", es3: "roto" },
    { v1: "drive", v2: "drove", v3: "driven", es: "conducir", es2: "condujo", es3: "conducido" },
    { v1: "lose", v2: "lost", v3: "lost", es: "perder", es2: "perdió", es3: "perdido" },
    { v1: "teach", v2: "taught", v3: "taught", es: "enseñar", es2: "enseñó", es3: "enseñado" },
    { v1: "grow", v2: "grew", v3: "grown", es: "crecer", es2: "creció", es3: "crecido" },
    { v1: "pay", v2: "paid", v3: "paid", es: "pagar", es2: "pagó", es3: "pagado" },
    { v1: "choose", v2: "chose", v3: "chosen", es: "elegir", es2: "eligió", es3: "elegido" },
    { v1: "wear", v2: "wore", v3: "worn", es: "llevar", es2: "llevó", es3: "llevado" },
    { v1: "catch", v2: "caught", v3: "caught", es: "atrapar", es2: "atrapó", es3: "atrapado" },
    { v1: "throw", v2: "threw", v3: "thrown", es: "lanzar", es2: "lanzó", es3: "lanzado" },
    { v1: "sit", v2: "sat", v3: "sat", es: "sentarse", es2: "se sentó", es3: "sentado" },
    { v1: "spend", v2: "spent", v3: "spent", es: "gastar", es2: "gastó", es3: "gastado" },
    { v1: "cut", v2: "cut", v3: "cut", es: "cortar", es2: "cortó", es3: "cortado" },
    { v1: "draw", v2: "drew", v3: "drawn", es: "dibujar", es2: "dibujó", es3: "dibujado" },
    { v1: "hear", v2: "heard", v3: "heard", es: "oír", es2: "oyó", es3: "oído" },
    { v1: "meet", v2: "met", v3: "met", es: "conocer", es2: "conoció", es3: "conocido" },
    { v1: "stand", v2: "stood", v3: "stood", es: "estar de pie", es2: "estuvo de pie", es3: "estado de pie" }
];

const TOPIC_SUMMARIES = {

  "Faz 1: To Be (Am/Is/Are)": {
    level: "A1",
    summary: `"To be" İngilizcenin en temel fiilidir. Türkçedeki "-dir/-dır/-im/-sin" eklerinin karşılığıdır.

📌 Yapı:
  I         → am
  You/We/They → are
  He/She/It  → is

📌 Cümle Kalıbı:
  Özne + am/is/are + sıfat / isim / yer

✅ Örnekler:
  • I am a student. (Ben öğrenciyim.)
  • She is very happy. (O çok mutlu.)
  • They are at school. (Onlar okulda.)

❌ Sık Hatalar:
  • He are tired. ❌ → He is tired. ✅
  • I is hungry. ❌ → I am hungry. ✅

💡 İpucu:
  Olumsuz yapmak için "not" ekle:
  I am not → I'm not
  He is not → He isn't
  They are not → They aren't`
  },

  "Faz 1: To Be (Was/Were)": {
    level: "A1",
    summary: `"Was/Were", "am/is/are" fiilinin geçmiş zamanıdır. Türkçedeki "-di/-dı" ekiyle kurulur.

📌 Yapı:
  I/He/She/It   → was
  You/We/They   → were

📌 Kullanım:
  Geçmişte bir durumu, kimliği veya yeri anlatmak için kullanılır.

✅ Örnekler:
  • I was very tired yesterday. (Dün çok yorgundum.)
  • The weather was cold. (Hava soğuktu.)
  • We were at the cinema. (Sinemadaydık.)

❌ Sık Hatalar:
  • They was late. ❌ → They were late. ✅
  • You was wrong. ❌ → You were wrong. ✅

💡 İpucu:
  Soru yapmak için özneyle yer değiştir:
  Was he tired? / Were they at home?`
  },

  "Faz 1: İsimler (Nouns)": {
    level: "A1",
    summary: `İngilizce isimler sayılabilir ve sayılamaz olmak üzere ikiye ayrılır.

📌 Sayılabilir (Countable):
  Tekil: a book, an apple, one cat
  Çoğul: books, apples, cats
  Düzensiz çoğullar: child → children, man → men, tooth → teeth

📌 Sayılamaz (Uncountable):
  Çoğul almaz: water, money, information, advice, news
  Miktar için: a glass of water, some information, a piece of advice

✅ Örnekler:
  • There are three apples on the table.
  • I need some information. (informations ❌)
  • Can I have a piece of bread?

❌ Sık Hatalar:
  • advices ❌ → advice ✅ (sayılamaz)
  • informations ❌ → information ✅

💡 İpucu:
  "some/any" sayılamaz isimlerle de kullanılabilir:
  I have some money. / Do you have any water?`
  },

  "Faz 1: Belirteçler (A, An, The)": {
    level: "A1",
    summary: `Article'lar İngilizceye özgüdür. Türkçede karşılıkları yoktur ama kritik öneme sahiptir.

📌 "A / An" — Belirsiz Article:
  • İlk kez bahsedilen şeyler için
  • "A" → sessiz harfle başlayan kelimeler: a car, a book
  • "An" → sesli harfle başlayan kelimeler: an apple, an hour

📌 "The" — Belirli Article:
  • Daha önce bahsedilen veya herkesçe bilinen şeyler için
  • Dünyada tek olan şeyler: the sun, the moon, the Earth
  • Sıfat üstünlükleriyle: the best, the first

📌 Article Yok (Ø):
  • Genel ifadeler: I like music. / Dogs are loyal.
  • Özel isimler: Turkey, John, Mount Everest

✅ Örnekler:
  • I saw a dog. The dog was very big.
  • The sun rises in the east.
  • She is an engineer.

❌ Sık Hatalar:
  • I am student. ❌ → I am a student. ✅
  • Sun is hot. ❌ → The sun is hot. ✅`
  },

  "Faz 1: Zamirler (Pronouns)": {
    level: "A1",
    summary: `Zamirler isimlerin yerine geçer. İngilizce zamirlerin farklı formları vardır.

📌 Kişi Zamirleri:
  Özne:   I, you, he, she, it, we, they
  Nesne:  me, you, him, her, it, us, them
  İyelik: my, your, his, her, its, our, their
  İyelik (tek başına): mine, yours, his, hers, ours, theirs

📌 Dönüşlü Zamirler (-self):
  myself, yourself, himself, herself, itself
  ourselves, yourselves, themselves

✅ Örnekler:
  • I made this myself. (Bunu kendim yaptım.)
  • That car is theirs. (O araba onlarınki.)
  • Give it to him, not her. (Ona ver, ona değil.)

❌ Sık Hatalar:
  • Give it to I. ❌ → Give it to me. ✅
  • This is my. ❌ → This is mine. ✅

💡 İpucu:
  "his" hem iyelik sıfatı hem de bağımsız iyelik zamiri olarak kullanılır:
  his book (iyelik) / This book is his. (bağımsız)`
  },

  "Faz 1: They/There/Demonstratives": {
    level: "A1",
    summary: `"There is/are" ve işaret zamirleri sıklıkla karıştırılır.

📌 There is / There are:
  • Bir şeyin varlığını/yokluğunu belirtir
  • Tekil: There is a cat on the roof.
  • Çoğul: There are many people here.
  • Geçmiş: There was / There were

📌 İşaret Zamirleri:
  Yakın:  this (tekil) / these (çoğul)
  Uzak:   that (tekil) / those (çoğul)

✅ Örnekler:
  • There are no people in the street.
  • Those books are very interesting.
  • This is my bag. That is yours.
  • These shoes are comfortable.

❌ Sık Hatalar:
  • There is many people. ❌ → There are many people. ✅
  • This books are... ❌ → These books are... ✅

💡 İpucu:
  "they" (onlar) ≠ "there" (orada/var) — telaffuz farkına dikkat et!`
  },

  "Faz 1: Miktar Belirteçleri": {
    level: "A2",
    summary: `Miktar belirteçleri sayılabilir ve sayılamaz isimlerde farklı kullanılır.

📌 Sayılabilir + Sayılamaz:
  some (olumlu), any (soru/olumsuz), no, a lot of, lots of, enough

📌 Sadece Sayılabilir:
  many, a few, few, several, a number of

📌 Sadece Sayılamaz:
  much, a little, little, a great deal of

✅ Örnekler:
  • I do not have much time. (Çok fazla zamanım yok.)
  • Only a few friends came to the party.
  • There is a little water left.
  • Do you have any questions?

❌ Sık Hatalar:
  • I have many money. ❌ → I have a lot of money. ✅
  • She has much friends. ❌ → She has many friends. ✅

💡 İpucu:
  "few/little" = az (olumsuz anlam)
  "a few/a little" = biraz (olumlu anlam)
  A few friends came. ✅ (iyi — biri geldi)
  Few friends came. ✅ (kötü — neredeyse kimse gelmedi)`
  },

  "Faz 2: Geniş Zaman (Present Simple)": {
    level: "A1",
    summary: `Present Simple alışkanlıkları, gerçekleri ve rutinleri anlatır.

📌 Yapı:
  (+) I/You/We/They + fiil
      He/She/It + fiil + s/es
  (-) I don't / He doesn't + fiil
  (?) Do I/you? / Does he/she?

📌 Ne Zaman Kullanılır?
  • Alışkanlıklar: I drink coffee every morning.
  • Genel gerçekler: The sun rises in the east.
  • Düzenli olaylar: The train leaves at 8.

📌 Zaman İfadeleri:
  always, usually, often, sometimes, rarely, never
  every day/week/morning, on Mondays

✅ Örnekler:
  • I drink coffee every morning.
  • He does not work on weekends.
  • Does she speak English?

❌ Sık Hatalar:
  • She work here. ❌ → She works here. ✅
  • He don't like it. ❌ → He doesn't like it. ✅`
  },

  "Faz 2: Şimdiki Zaman (Present Cont.)": {
    level: "A1",
    summary: `Present Continuous şu an olan veya geçici devam eden eylemleri anlatır.

📌 Yapı:
  am/is/are + fiil + -ing

📌 Ne Zaman Kullanılır?
  • Şu an olan eylemler: I am reading right now.
  • Geçici durumlar: She is staying with us this week.
  • Yakın gelecek planlar: I am meeting him tomorrow.

📌 Zaman İfadeleri:
  now, right now, at the moment, currently, this week

✅ Örnekler:
  • I am reading a book right now.
  • Listen, someone is singing.
  • They are not coming tonight.

❌ Sık Hatalar:
  • I am know him. ❌ → I know him. ✅ (bilmek -ing almaz!)
  • She is have a car. ❌ → She has a car. ✅

💡 İpucu:
  -ing almayan fiiller: know, like, love, hate, want, need, believe, understand`
  },

  "Faz 2: Geçmiş Zaman (Past Simple)": {
    level: "A1",
    summary: `Past Simple geçmişte tamamlanmış olayları anlatır.

📌 Yapı:
  (+) Düzenli: fiil + -ed (worked, played, watched)
      Düzensiz: özel form (went, saw, bought, came)
  (-) did not (didn't) + fiilin 1. hali
  (?) Did + özne + fiilin 1. hali?

📌 Ne Zaman Kullanılır?
  • Belirli bir geçmiş an: I called you yesterday.
  • Tamamlanmış olaylar: She graduated in 2020.

📌 Zaman İfadeleri:
  yesterday, last night/week/year, ago, in 2020, when I was young

✅ Örnekler:
  • I watched a new movie last night.
  • Why did you go to the party early?
  • We didn't see him at school.

❌ Sık Hatalar:
  • I did went. ❌ → I went. ✅
  • Did you went? ❌ → Did you go? ✅`
  },

  "Faz 2: Geçmişte Devam Eden (Past Cont.)": {
    level: "B1",
    summary: `Past Continuous geçmişte devam etmekte olan bir eylemi anlatır.

📌 Yapı:
  was/were + fiil + -ing

📌 Ne Zaman Kullanılır?
  • Geçmişte devam eden eylem: I was sleeping at 10pm.
  • Başka bir eylem olduğunda arka planda devam eden: I was sleeping when you called.
  • İki eş zamanlı eylem: She was cooking while I was cleaning.

📌 Kalıp:
  While + Past Continuous, Past Simple
  When + Past Simple, Past Continuous

✅ Örnekler:
  • I was sleeping when you called.
  • It was raining when I went outside.
  • They were watching TV while I was studying.

❌ Sık Hatalar:
  • I was sleep when... ❌ → I was sleeping when... ✅
  • When I called, she was cook. ❌ → she was cooking. ✅`
  },

  "Faz 2: Present Perfect": {
    level: "B1",
    summary: `Present Perfect geçmişle bağlantısı olan olayları anlatır. Türkçeye genellikle "-di" veya "-miş" ile çevrilir ama anlamı farklıdır.

📌 Yapı:
  have/has + fiilin 3. hali (past participle)

📌 Ne Zaman Kullanılır?
  • Sonucu şu an hissedilen geçmiş: I have lost my keys. (Hâlâ kayıp!)
  • Hayat deneyimleri: Have you ever been to Paris?
  • Henüz tamamlanmamış: I haven't finished yet.
  • Yeni olan haber: She has just arrived.

📌 Anahtar Kelimeler:
  ever, never, already, yet, just, recently, since, for

✅ Örnekler:
  • I have lost my keys, I cannot find them.
  • Have you ever been to London?
  • She has just called me.

❌ Sık Hatalar:
  • I have went. ❌ → I have gone. ✅
  • Did you ever eat sushi? ❌ → Have you ever eaten sushi? ✅`
  },

  "Faz 2: Present Perfect Cont.": {
    level: "B1",
    summary: `Present Perfect Continuous bir eylemin geçmişte başlayıp hâlâ devam ettiğini vurgular.

📌 Yapı:
  have/has + been + fiil + -ing

📌 Ne Zaman Kullanılır?
  • Hâlâ devam eden eylem: I have been waiting for an hour.
  • Yorgunluk/iz bırakan eylem: She looks tired — she has been working all day.

📌 Fark:
  Present Perfect: I have read 3 books. (tamamlandı, sonuç var)
  Present Perfect Cont.: I have been reading for 2 hours. (devam ediyor)

📌 Anahtar Kelimeler:
  since (beri — başlangıç noktası), for (süredir — süre)

✅ Örnekler:
  • I have been studying since morning.
  • How long have you been living here?
  • It has been raining for three days.

❌ Sık Hatalar:
  • I am studying since morning. ❌ → I have been studying since morning. ✅`
  },

  "Faz 2: Past Perfect": {
    level: "B2",
    summary: `Past Perfect geçmişte başka bir olaydan önce olan eylemi anlatır. Türkçedeki "-mıştı" ekine karşılık gelir.

📌 Yapı:
  had + fiilin 3. hali (past participle)

📌 Ne Zaman Kullanılır?
  • Geçmişte iki olaydan önce olanı belirtmek için
  • "Daha önce, o sıralar çoktan" anlamı

📌 Kalıp:
  When + Past Simple, Past Perfect (çoktan olmuştu)
  By the time + Past Simple, Past Perfect

✅ Örnekler:
  • The guests had already left when we arrived.
  • When I got to the station, the train had departed.
  • She had studied English before she moved to the US.

❌ Sık Hatalar:
  • When I arrived, they already left. ❌ → they had already left. ✅

💡 İpucu:
  Hangi olay ÖNCE oldu? O olaya "had + V3" kullan.`
  },

  "Faz 2: Gelecek Zaman (Future)": {
    level: "A2",
    summary: `İngilizce'de gelecek zaman için iki ana yapı vardır: "will" ve "be going to".

📌 WILL:
  (+) will + fiil
  Kullanım:
  • Anlık karar: I'll help you with that.
  • Tahmin (kanıtsız): I think it will rain.
  • Söz/teklif: I will call you later.

📌 BE GOING TO:
  am/is/are + going to + fiil
  Kullanım:
  • Önceden planlanan: I am going to meet a friend tonight.
  • Belirtiye dayalı tahmin: Look at those clouds — it's going to rain!

📌 Zaman İfadeleri:
  tomorrow, next week/month, soon, in the future, tonight

✅ Örnekler:
  • I think it will rain tomorrow.
  • I am going to meet a friend this evening.
  • She will probably call you back.

❌ Sık Hatalar:
  • I will to go. ❌ → I will go. ✅
  • I going to call. ❌ → I am going to call. ✅`
  },

  "Faz 3: Yetenek (Ability)": {
    level: "A2",
    summary: `Yetenek ve beceri anlatmak için "can" ve "could" kullanılır.

📌 Yapı:
  can/could + fiilin 1. hali (yalın hali)

📌 CAN:
  • Şimdiki yetenek: I can swim very well.
  • Olasılık/izin: Can I sit here?

📌 COULD:
  • Geçmişteki yetenek: I could run very fast when I was a child.
  • Kibar istek/teklif: Could you help me, please?

📌 BE ABLE TO:
  Can/could'un yerine kullanılabilir, tüm zamanlarda çalışır:
  I will be able to come. / I have been able to...

✅ Örnekler:
  • I could run very fast when I was a child.
  • She can speak four languages.
  • I wasn't able to finish on time.

❌ Sık Hatalar:
  • I can to swim. ❌ → I can swim. ✅
  • She coulds speak. ❌ → She could speak. ✅`
  },

  "Faz 3: Zorunluluk (Obligation)": {
    level: "A2",
    summary: `Zorunluluk anlatmak için "must", "have to" ve "need to" kullanılır.

📌 MUST:
  • Konuşmacının koyduğu zorunluluk / kuvvetli tavsiye
  • You must see this film! (Mutlaka izlemelisin!)
  • Çoğunlukla resmi kurallarda: Passengers must fasten seatbelts.

📌 HAVE TO:
  • Dış kaynaklı zorunluluk (kural, başkası söyledi)
  • I have to wear a uniform at work.
  • Tüm zamanlarda kullanılabilir: had to, will have to

📌 MUSTN'T vs. DON'T HAVE TO:
  • mustn't = yasak: You mustn't park here.
  • don't have to = gerekli değil: You don't have to come.

✅ Örnekler:
  • We have to obey traffic rules.
  • You must not smoke in here.
  • She didn't have to pay — it was free.

❌ Sık Hatalar:
  • I must to go. ❌ → I must go. ✅`
  },

  "Faz 3: Tavsiye (Advice)": {
    level: "B1",
    summary: `Tavsiye vermek için "should", "ought to" ve "had better" kullanılır.

📌 SHOULD:
  • Genel tavsiye: You should eat more vegetables.
  • Beklenti: The package should arrive tomorrow.
  (+) should + fiil
  (-) should not (shouldn't) + fiil

📌 OUGHT TO:
  Should ile neredeyse aynı anlam, daha resmi:
  You ought to apologize.

📌 HAD BETTER:
  • Daha güçlü uyarı, sonuç ima eder:
  You had better leave now or you'll miss the bus.

✅ Örnekler:
  • That movie is very bad, you should not watch it.
  • You should see a doctor.
  • I think you ought to call him.

❌ Sık Hatalar:
  • You should to study. ❌ → You should study. ✅
  • He should goes. ❌ → He should go. ✅`
  },

  "Faz 3: İhtimal (Possibility)": {
    level: "B1",
    summary: `Olasılık ve ihtimal anlatmak için modal fiiller kullanılır.

📌 Olasılık Sıralaması (en kesin → en az kesin):
  must (kesinlikle öyledir) → should (muhtemelen) → 
  may (belki) → might (belki/daha az ihtimalle) → could (mümkün)

📌 Şimdiki İhtimal:
  • She must be tired. (Kesinlikle yorgun.)
  • He might be at home. (Evde olabilir.)
  • It may rain. (Yağmur yağabilir.)

📌 Geçmiş İhtimal:
  modal + have + V3
  • She might have forgotten. (Unutmuş olabilir.)
  • He must have been stuck in traffic.

✅ Örnekler:
  • The weather is cloudy, it might rain.
  • She may not come to the party.
  • They could be on their way.

❌ Sık Hatalar:
  • It might rains. ❌ → It might rain. ✅`
  },

  "Faz 3: Geçmiş Çıkarımlar (Past Modals)": {
    level: "B2",
    summary: `Geçmişe ait tahmin ve çıkarımlar için "modal + have + V3" yapısı kullanılır.

📌 Yapı:
  modal + have + fiilin 3. hali (past participle)

📌 Anlamlar:
  • must have + V3   → kesinlikle öyle olmuştur
  • can't have + V3  → kesinlikle olmamıştır
  • might/may have + V3 → belki olmuştur
  • should have + V3 → olması gerekirdi (ama olmadı)
  • could have + V3  → olabilirdi (ama olmadı)

✅ Örnekler:
  • He is late — he must have been stuck in traffic.
  • She can't have said that — she's very kind.
  • I should have studied more for the exam.
  • You could have called me!

❌ Sık Hatalar:
  • He must have forgot. ❌ → He must have forgotten. ✅
  • She should had called. ❌ → She should have called. ✅`
  },

  "Faz 4: Karşılaştırma (Comparatives)": {
    level: "A2",
    summary: `İki şeyi karşılaştırmak için comparative sıfat kullanılır.

📌 Yapı:
  Kısa sıfat (1-2 hece): sıfat + -er + than
  Uzun sıfat (2+ hece): more + sıfat + than
  Düzensizler: good→better, bad→worse, far→farther/further

📌 Kural:
  • tall → taller than
  • happy → happier than
  • expensive → more expensive than
  • interesting → more interesting than

📌 Eşitlik: as + sıfat + as
  She is as tall as her brother.

✅ Örnekler:
  • This car is more expensive than the other one.
  • He is taller than me.
  • Today is worse than yesterday.

❌ Sık Hatalar:
  • more taller ❌ → taller ✅
  • more better ❌ → better ✅
  • taller as me ❌ → taller than me ✅`
  },

  "Faz 4: En Üstünlük (Superlatives)": {
    level: "A2",
    summary: `Üç veya daha fazla şey içinden en üstünü belirtmek için superlative kullanılır.

📌 Yapı:
  Kısa sıfat: the + sıfat + -est
  Uzun sıfat: the most + sıfat
  Düzensizler: good→the best, bad→the worst, far→the farthest

📌 Örnekler:
  • tall → the tallest
  • happy → the happiest
  • expensive → the most expensive
  • interesting → the most interesting

📌 Kullanım:
  Genellikle "in" (yer) veya "of" (grup) ile birlikte gelir:
  the tallest student in the class
  the best of all

✅ Örnekler:
  • Ali is the tallest student in the class.
  • This is the most expensive restaurant in the city.
  • She is the best player on the team.

❌ Sık Hatalar:
  • most tallest ❌ → the tallest ✅
  • the more expensive ❌ → the most expensive ✅`
  },

  "Faz 4: Zaman/Yer Edatları (Prepositions)": {
    level: "A2",
    summary: `Zaman ve yer edatları İngilizce öğrencilerin en çok hata yaptığı konudur.

📌 Zaman Edatları:
  AT → belirli saat/an: at 5 o'clock, at midnight, at Christmas
  ON → gün/tarih: on Monday, on July 4th, on my birthday
  IN → uzun dönem: in the morning, in July, in 2024, in winter

📌 Yer Edatları:
  AT → nokta, adres: at school, at the bus stop, at 23 Main St.
  ON → yüzey üstü: on the table, on the wall, on the floor
  IN → içinde: in the box, in Turkey, in the room

📌 Kalıp:
  Saat → at
  Gün → on
  Ay/Yıl/Mevsim → in

✅ Örnekler:
  • The meeting is on Monday at five o'clock.
  • I was born in July, in 1995.
  • She is waiting at the door.

❌ Sık Hatalar:
  • in Monday ❌ → on Monday ✅
  • at the morning ❌ → in the morning ✅`
  },

  "Faz 4: Bağlaçlar (Conjunctions)": {
    level: "B1",
    summary: `Bağlaçlar cümleleri ve fikirleri birbirine bağlar.

📌 Sıralama Bağlaçları:
  and (ve), but (ama), or (veya), so (bu yüzden), yet (buna rağmen)

📌 Zıtlık:
  although / even though / though → rağmen (cümle başı)
  however / nevertheless → ancak (cümle arası, noktalı virgülle)
  despite / in spite of → rağmen (isim/zamir öncesi)

📌 Sebep-Sonuç:
  because (çünkü), since/as (çünkü), therefore (bu nedenle)

📌 Şart:
  if, unless (eğer...mezse), as long as, provided that

✅ Örnekler:
  • Although he was tired, he continued to work.
  • She studied hard, so she passed the exam.
  • Unless you hurry, you'll miss the train.

❌ Sık Hatalar:
  • Although... but... ❌ → ikisi birlikte kullanılmaz
  • Despite he was tired ❌ → Despite being tired ✅`
  },

  "Faz 5: Koşul Cümleleri (If Clauses)": {
    level: "B1",
    summary: `If Clauses (Koşul Cümleleri) koşul-sonuç ilişkisi kurar. 4 tipi vardır.

📌 Type 0 — Genel Gerçek:
  If + Present Simple → Present Simple
  If you heat water to 100°C, it boils.

📌 Type 1 — Gerçek Koşul (Gelecek):
  If + Present Simple → will + fiil
  If you wake up early, you will catch the train.

📌 Type 2 — Hayali/Olası Olmayan:
  If + Past Simple → would + fiil
  If I were rich, I would buy a boat.
  (NOT: If I was → If I were ✅ — resmi kullanım)

📌 Type 3 — Geçmişte Gerçekleşmemiş:
  If + Past Perfect → would have + V3
  If I had studied, I would have passed.

✅ Örnekler:
  • If you wake up early, you will catch the train.
  • If I were rich, I would buy a boat.

❌ Sık Hatalar:
  • If I will go ❌ → If I go ✅ (Type 1'de will olmaz)
  • If I would... ❌ → If I... ✅`
  },

  "Faz 5: Edilgen Çatı (Passive Voice)": {
    level: "B1",
    summary: `Passive Voice eylemi kimin yaptığından çok ne yapıldığını ön plana çıkarır.

📌 Yapı:
  am/is/are/was/were/have been + fiilin 3. hali (past participle)

📌 Zaman Göre:
  Present: The letter is written.
  Past: The bridge was built last year.
  Future: The project will be completed.
  Perfect: The report has been sent.

📌 Ne Zaman Kullanılır?
  • Kim yaptığı bilinmiyor: My car was stolen.
  • Kim yaptığı önemli değil: English is spoken worldwide.
  • Resmi/akademik yazı

📌 Failden bahsetmek: by
  The bridge was built by Romans.

✅ Örnekler:
  • This bridge was built last year.
  • English is spoken in many countries.
  • The email has been sent.

❌ Sık Hatalar:
  • It was build ❌ → It was built ✅
  • The bridge builded ❌ → was built ✅`
  },

  "Faz 5: Sıfat Cümlecikleri (Relative Clauses)": {
    level: "B2",
    summary: `Relative Clauses bir ismi tanımlayan veya hakkında bilgi veren yan cümleciklerdir.

📌 Bağlantı Zamirleri:
  who   → insanlar için
  which → nesneler/hayvanlar için
  that  → her ikisi için (kısıtlayıcı cümleciklerde)
  whose → iyelik (kimin/hangi)
  where → yer için
  when  → zaman için

📌 Kısıtlayıcı (Defining):
  Virgül yok — cümle anlamı için şart:
  The man who called you is my boss.

📌 Kısıtlamayan (Non-defining):
  Virgülle ayrılır — ek bilgi:
  My brother, who lives in London, is a doctor.

✅ Örnekler:
  • The car that I bought yesterday broke down.
  • The woman who helped me was very kind.
  • This is the city where I was born.

❌ Sık Hatalar:
  • The man which called ❌ → who called ✅ (insan için who)
  • The car who I bought ❌ → which/that I bought ✅`
  },

  "Faz 5: Fiilimsiler (Gerunds & Infinitives)": {
    level: "B2",
    summary: `Bazı fiiller arkasına gerund (-ing), bazıları infinitive (to + fiil) alır.

📌 GERUND (-ing):
  Fiil isim olarak kullanılır.
  Bunlardan sonra gerund gelir:
  enjoy, avoid, finish, mind, consider, suggest, keep, practice
  → I enjoy traveling alone.
  → She avoids eating fast food.

📌 İNFİNİTİVE (to + fiil):
  Bunlardan sonra infinitive gelir:
  want, need, decide, plan, hope, agree, refuse, learn, seem
  → I want to learn Spanish.
  → She decided to quit her job.

📌 Her İkisini De Alanlar (anlam değişmez):
  like, love, hate, start, begin, continue
  → I love swimming. / I love to swim.

📌 Anlam Değişenler:
  remember + -ing = geçmiş anı hatırlamak
  remember + to = bir şeyi yapmayı unutmamak

✅ Örnekler:
  • I enjoy traveling alone.
  • She decided to leave early.

❌ Sık Hatalar:
  • I enjoy to travel. ❌ → I enjoy traveling. ✅
  • She wants going. ❌ → She wants to go. ✅`
  },

  "Faz 5: Dolaylı Anlatım (Reported Speech)": {
    level: "B2",
    summary: `Reported Speech başkasının söylediklerini aktarırken kullanılır. Zaman bir adım geriye kayar.

📌 Zaman Kayması:
  Present Simple   → Past Simple
  Present Cont.    → Past Continuous
  Past Simple      → Past Perfect
  will             → would
  can              → could
  am/is/are going to → was/were going to

📌 Zamir ve Zaman Değişiklikleri:
  "I" → he/she
  "tomorrow" → the next day / the following day
  "yesterday" → the day before
  "here" → there

📌 Yapılar:
  Cümle: He said (that) he would not go there.
  Soru:  She asked if/whether I was coming.
  Emir:  She told me to sit down.

✅ Örnekler:
  • "I will not go." → He told me he would not go there.
  • "Are you ready?" → She asked if I was ready.

❌ Sık Hatalar:
  • He said me that... ❌ → He told me that... ✅
  • She said that she will... ❌ → she would... ✅`
  },

  "Faz 5: Ettirgen (Causatives)": {
    level: "B2",
    summary: `Causative yapılar başkasına bir şey yaptırdığımızı anlatır.

📌 HAVE + nesne + V3 (past participle):
  Profesyonel bir hizmeti başkasına yaptırmak:
  I had my hair cut. (Saçımı kestirdim — berbere.)
  She had her car repaired. (Arabasını tamir ettirdi.)

📌 GET + nesne + V3:
  Have ile benzer, daha günlük konuşma dili:
  I got my hair cut.
  He got his phone fixed.

📌 MAKE + nesne + fiilin 1. hali:
  Zorlamak, mecbur bırakmak:
  The teacher made us study all day.
  What made you change your mind?

📌 LET + nesne + fiilin 1. hali:
  İzin vermek:
  My parents let me stay out late.

✅ Örnekler:
  • I had my hair cut yesterday.
  • She made him apologize.
  • They let the children play outside.

❌ Sık Hatalar:
  • I had my hair cutting. ❌ → had my hair cut. ✅
  • She made him to apologize. ❌ → made him apologize. ✅`
  }

};
