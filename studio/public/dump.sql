﻿PRAGMA foreign_keys=OFF; BEGIN TRANSACTION; CREATE TABLE `groups` (`id` integer PRIMARY KEY AUTOINCREMENT, `name` varchar(255) UNIQUE); INSERT INTO "groups" VALUES(1,'A'); INSERT INTO "groups" VALUES(2,'B'); INSERT INTO "groups" VALUES(3,'C'); INSERT INTO "groups" VALUES(4,'D'); INSERT INTO "groups" VALUES(5,'E'); INSERT INTO "groups" VALUES(6,'F'); INSERT INTO "groups" VALUES(7,'G'); INSERT INTO "groups" VALUES(8,'H'); INSERT INTO "groups" VALUES(9,'Round of 16'); INSERT INTO "groups" VALUES(10,'Quarter Final'); INSERT INTO "groups" VALUES(11,'Semi Final'); INSERT INTO "groups" VALUES(12,'Third Place Match'); INSERT INTO "groups" VALUES(13,'Grand Final'); CREATE TABLE `teams` (`id` integer PRIMARY KEY AUTOINCREMENT, `name` varchar(255), `ranking` integer, `name_ar` varchar(255), `abrv` varchar(255), `info` varchar(255), `youtube_url` string); INSERT INTO "teams" VALUES(6,'Algeria',30,'الجزائر','ALG','تمثل مشاركة المنتخب الجزائري في نهائيات كأس العالم جنوب أفريقيا 2010 ثالث حضور له في المونديال، علما أنه لم يتمكن حتى الآن من تجاوز دور المجموعات. دخل المنتخب التاريخ في نسخة 1982 بفوزه على كل من ألمانيا(2-1) وتشيلي (3-2). وبعد ذلك بأربع سنوات لم يتمكن الفريق بقيادة رابح سعدان من خطف سوى نقطة واحدة من تعادل أمام أيرلندا الشمالية (1-1) تمثل مشاركة المنتخب الجزائري في نهائيات كأس العالم جنوب أفريقيا 2010 ثالث حضور له في المونديال، علما أنه لم يتمكن حتى الآن من تجاوز دور المجموعات. دخل المنتخب التاريخ في نسخة 1982 بفوزه على كل من ألمانيا(2-1) وتشيلي (3-2). وبعد ذلك بأربع سنوات لم يتمكن الفريق بقيادة رابح سعدان من خطف سوى نقطة واحدة من تعادل أمام أيرلندا الشمالية (1-1)','http://www.youtube.com/watch?v=FSa--49uQ38'); INSERT INTO "teams" VALUES(7,'Argentina',7,'الأرجنتين','ARG','وصل المنتخب الأرجنتيني إلى المباراة النهائية في كأس العالم 4 مرات: ففاز على هولندا سنة 1978 وعلى ألمانيا سنة 1986، وخسر من أوروجواي سنة 1930 ومن ألمانيا سنة 1990. تشهد دورة جنوب إفريقيا 2010 المشاركة رقم 20 لمنتخب الأرجنتين في البطولة ورقم 10 على التوالي. تعتبر دورة جنوب إفريقيا 2010 خامس مشاركة لدييجو مارادونا في نهائيات كأس العالم، بعد أن شارك في دورات 1982 و1986 و1990 و1994. ','http://www.youtube.com/watch?v=4m_sTwiFlxk'); INSERT INTO "teams" VALUES(8,'Australia',20,'أستراليا','AUS','شاركت أستراليا في نهائيات كأس العالم مرتين فقط، لكنها الآن عوضت الوقت الضائع من خلال تأهلها للمرة الثانية على التوالي. بعد مشاركة أولى عام 1974 في المانيا خرجت فيها من الدور الاول بمشاركة لاعبين معظمهم من الهواة, عادت مرة أخرى بعد 32 عام إلى ألمانيا حيث كانت مشاركته ناجحة لأنه أنهى دور المجموعات في المركز الثاني خلف البرازيل متقدماً على كرواتيا واليابان. حقق مارك شفارتس رقماً قياسياً محلياً بإحتفاظه بشباكه خالية من الأهداف على مدى سبع مباريات خلال تصفيات كأس العالم. ','http://www.youtube.com/watch?v=6vfoEbA7aMI'); INSERT INTO "teams" VALUES(9,'Brazil',1,'البرازيل','BRA','شارك منتخب البرازيل في نهائيات كأس العالم 19 مرة وهو بذلك المنتخب الوحيد الذي شارك في جميع الدورات المونديالية. كما أنه البلد الوحيد الذي نال خمسة ألقاب: 64 فوزا و 14 تعادلا و 14 هزيمة في 92 مباراة. لم تنهزم البرازيل في أي من المباريات 19 التي أجرتها في الفترة الممتدة ما بين 15 يونيو 2008 و 11 أكتوبر/تشرين الأول 2009. أنهت البرازيل 12 مرة الترتيب السنوي للمنتخبات على رأس قائمة التصنيف العالمي، وهي على وشك الاحتفاظ بنفس الترتيب للمرة 13 في سنة 2009. ','http://www.youtube.com/watch?v=9LLQcReMKSg'); INSERT INTO "teams" VALUES(10,'Cameroon',19,'الكاميرون','CMR','خرج منتخب الكاميرون من الدور الاول لكأس العالم في اسبانيا عام 1982 على الرغم من إنه لم يهزم, فتعادل في مبارياته الثلاث لتتأهل إيطاليا على حسابه بفارق الأهداف. خاض المنتخب الكاميروني 17 مباراة في نهائيات كأس العالم وهي أعلى نسبة لمنتخب أفريقي. يعتبر فوز الكاميرون على الأرجنتين في المباراة الإفتتاحية لكأس العالم في إيطاليا عام 1990 من أكبر المفاجآت في تاريخ النهائيات. يعتبر روجيه ميلا أكبر لاعب سنا يسجل هدفاً في النهائيات عندما هز شباك منتخب روسيا في كأس العالم في الولايات المتحدة عام 1994. ','http://www.youtube.com/watch?v=gaAq2LcbKPY'); INSERT INTO "teams" VALUES(11,'Chile',18,'تشيلي','CHI','تشهد بطولة كأس العالم 2010 ثامن مشاركة لتشيلي في النهائيات. أفضل نتيجة حققتها تشيلي في المونديال كانت في عام 1962، عندما نظمت البطولة واحتلت المرتبة الثالثة. يعتبر كل من جييرمو سوبيابري (1930)، وليونيل راميريز (1962)، ومارسيلو سالاس (1998) أفضل الهدافين التشيليين في تاريخ منافسات كأس العالم حيث سجل كل منهم 4 أهداف. ','http://www.youtube.com/watch?v=Y3xCD8tW1Bk'); INSERT INTO "teams" VALUES(12,'Cote d''Ivoire',27,'كوت ديفوار','CIV','خلال نهائيات ألمانيا 2006، كان منتخب كوت ديفوار الفريق الوحيد المشكل من لاعبين يمارسون خارج أرض الوطن بنسبة 100%. كما يعتبر المنتخب الوحيد الذي نجح في التسجيل خلال كل المباريات التي خاضها ضمن نهائيات كأس العالم. تلقت شباك كوت ديفوار أهدافاً مبكرة في مباريات المنتخب الثلاث خلال نهائيات ألمانيا 2006، كما سجل المنتخب كل أهدافه الستة قبل الدقيقة الأربعين. يعج المنتخب الإيفواري بنجوم عالميين، يتقدمهم ثنائي تشيلسي ديدييه دروجبا وسالومون كالو. ','http://www.youtube.com/watch?v=BsnqkaHt290'); INSERT INTO "teams" VALUES(13,'Denmark',36,'الدنمارك','DEN','تشهد بطولة جنوب إفريقيا 2010 المشاركة الرابعة للمنتخب الدنماركي في نهائيات كأس العالم. بلغت الدنمارك دور الستة عشر في بطولتي 1986 و2002، وبلغت دور الثمانية في بطولة 1998. على المستوى القاري فازت الدنمارك باللقب الأوروبي سنة 1992، كما توج بكأس القارات 1995. حصل في مجموع مشاركاته الأوليمبية على ثلاث ميداليات فضية (1908 و1912 و1960)، وميدالية برونزية واحدة (1948). ','http://www.youtube.com/watch?v=w6hqaY5kWuU'); INSERT INTO "teams" VALUES(14,'England',8,'إنجلترا','ENG','تأهلت إنجلترا 11 مرة إلى نهائيات كأس العالم، كانت أولها في البرازيل عام 1950. وبعد فوز منتخب إنجلترا بلقبه الوحيد عندما استضاف البطولة عام 1966، يعد الوصول إلى نصف النهائي أبرز إنجاز حققه الفريق خارج أرضه. تمكن المنتخب الإنجليزي من إيجاد موقع له في المربع الذهبي خلال نهائيات 1990 . يعد وين روني أبرز هداف في خط الهجوم الإنجليزي. ','http://www.youtube.com/watch?v=Wj0itczfd-c'); INSERT INTO "teams" VALUES(15,'France',9,'فرنسا','FRA','شارك المنتخب الفرنسي 12 مرة بالنهائيات، لعب خلالها مبارتين نهائيتين، وتمكن من الفوز باللقب الذهبي مرة واحدة. قبل الفوز باللقب سنة 1998، استطاع "الزرق" احتلال المرتبة الثالثة خلال دورة 1958 و1986، وكذا المركز الرابع سنة 1982. فاز المنتخب الفرنسي مرتين بكأس القارات و مرتين بكأس أوروللأمم. ','http://www.youtube.com/watch?v=oiw5njE_sRI'); INSERT INTO "teams" VALUES(16,'Germany',6,'ألمانيا','GER','فازت ألمانيا حتى الآن بكأس العالم ثلاث مرات (1954 و1974 و1990)، ولا يتفوق عليها إلا البرازيل (5 مرات) وإيطاليا (4 مرات). باستثناء بطولات العالم التي نظمت في الفترة ما بين 1930 و1950، حيث لم تشارك حتى في مراحل التصفيات، كانت ألمانيا حاضرة في جميع دورات كأس العالم. بلغت ألمانيا الدور النهائي سبع مرات من مجموع مشاركاتها في منافسات كأس العالم، وهي تعتبر بجانب البرازيل المنتخب الذي شارك في أكبر عدد من المباريات النهائية في المونديال العالمي. اضطرت ألمانيا في أربع مناسبات إلى الاحتكام إلى ضربات الجزاء، حيث كان بإمكانها حسم المواجهات لصالحها. ','http://www.youtube.com/watch?v=klyKmNbIRYM'); INSERT INTO "teams" VALUES(17,'Ghana',32,'غانا','GHA','كان معدل أعمار لاعبي المنتخب الغاني هو الأصغر في كأس العالم ألمانيا 2006، حيث بلغ حوالي 24 سنة فقط. سجل أسامواه جيان أسرع هدف في كأس العالم 2006 حيث أتى في الثانية 68 من لقاء منتخب بلاده الذي انتصر فيه على جمهورية التشيك بنتيجة 2-1. وكان ذلك الهدف الأول لغانا في نهائيات كأس العالم. خسر المنتخب الغاني بثلاثة أهداف نظيفة مباراة ثمن نهائي كأس العالم بنسخته السابقة التي جمعته مع نظيره البرازيلي، لكنه افتقد في ذلك اللقاء لخدمات النجم مايكل إيسيان الموقوف. ','http://www.youtube.com/watch?v=1XEl8w5hGpQ'); INSERT INTO "teams" VALUES(18,'Greece',13,'اليونان','GRE','يخوض المنتخب اليوناني في جنوب أفريقيا 2010 FIFA ثاني نهائيات لكأس العالم في تاريخه بعد الولايات المتحدة 1994 . فاز المنتخب اليوناني بكأس الأمم الأوروبية البرتغال 2004. في جنوب أفريقيا 2010 يشارك أوتو ريهاجل (72 سنة) في أول مونديال له وسيكون أقدم المدربين سنا في هذا العرس الكروي العالمي. ','http://www.youtube.com/watch?v=fsifq6iCAdg'); INSERT INTO "teams" VALUES(19,'Honduras',38,'هندوراس','HON','تعود هندوراس إلى نهائيات كأس العالم بعد غياب دام 28 سنة، إذ ترجع أول وآخر مشاركة مونديالية لمنتخب الكاتراتشوس إلى دورة 1982 في إسبانيا. وقد تعادل هندوراس أمام منتخب البلد المضيف (1-1) وأمام آيرلندا الشمالية بالنتيجة ذاتها، قبل السقوط بهدف على يد يوغوسلافيا، وهي نتيجة حتمت على أبناء المدرب خوسيه لاباز العودة إلى ديارهم بمجرد انتهاء منافسات الدور الأول. وسجل هدفي الكاتراتشوس في تلك النهائيات كل من هكتور زيلايا أمام إسبانيا وأنتونيو لاينج في مرمى الأيرلندييين.','http://www.youtube.com/watch?v=KBsjG4qW0tk'); INSERT INTO "teams" VALUES(20,'Italy',5,'إيطاليا','ITA','ضمن المنتخب الإيطالي حضوره بالنهائيات خلال 16 مرة من أصل 18، حيث لم يتمكن من حجز تذكرة المرور لدورة سنة 1958، كما غاب عن أول نسخة سنة 1930. يعتبر المنتخب الإيطالي من أكبر المتوجين، إذ نال اللقب سنوات 1934 و1938 و1982 وأيضا 2006، كما لعب المباراة النهائية سنة 1970 و1994، واحتل المرتبة الثالثة سنة 1990. كما يفخرمارتشيلو ليبي بإنجازه الفريد من نوعه، إذ خاض 31 لقاء دوليا متواصلا دون أن يتعرض لأية هزيمة.','http://www.youtube.com/watch?v=2khmgPAz3Vo'); INSERT INTO "teams" VALUES(21,'Japan',45,'اليابان','JPN','تشهد نهائيات جنوب أفريقيا 2010 المشاركة الرابعة للمنتخب الياباني في بطولة كأس العالم وهي المشاركة الرابعة له على التوالي. ويعود أفضل حضور ياباني في المونديال إلى الدورة التي أقيمت على أرضه مناصفة مع كوريا الجنوبية سنة 2002، حيث اعتلى صدارة المجموعة الثامنة متفوقاً على منتخبات بلجيكا وروسيا وتونس ليصعد إلى المرحلة الثانية للمرة الأولى والوحيدة في تاريخه. في أول مشاركة لأوكادا كمدير فني في نهائيات كأس العالم فرنسا 1998، خسر المنتخب الياباني مبارياته الثلاث في المجموعة حيث سجل محاربو الساموراي هدفاً واحداً بينما اهتزت شباكهم أربع مرات. ','http://www.youtube.com/watch?v=RGrdBFaw60k'); INSERT INTO "teams" VALUES(22,'Korea DPR',105,'كوريا الشمالية','PRK','شاركت كوريا الشمالية للمرة الأولى في نهائيات كأس العالم في إنجلترا عام 196. ونجح المنتخب المغمور آنذاك في إلحاق هزيمة تاريخية بالعملاق الإيطالي بهدف نظيف ليبلغ الدور ربع النهائي. بلغ منتخب كوريا الشمالية الدور ربع النهائي في أول وآخر مشاركة له في نهائيات كأس العالم. ','http://www.youtube.com/watch?v=7YMFCA4hJvo'); INSERT INTO "teams" VALUES(23,'Korea Republic',47,'كوريا الجنوبية','KOR','يعتبر المنتخب الكوري الجنوبي الفريق الآسيوي الأكثر مشاركة في نهائيات كأس العالم إذ يستعد لخوض غمار البطولة للمرة الثامنة في تاريخه في جنوب أفريقيا. كانت أفضل نتيجة حققها المنتخب الكوري الجنوبي عندما إستضاف البطولة على أرضه وتخطى منتخبات أوروبية قوية أمثال البرتغال وإيطاليا وأسبانيا ليبلغ الدور نصف النهائي. يعول المنتخب كثيراً على المهاجم بارك تشو يونج لحل مشكلة العقم الهجومي أمام المرمى. ','http://www.youtube.com/watch?v=W3yD2RL7qOc'); INSERT INTO "teams" VALUES(24,'Mexico',17,'المكسيك','MEX','تأهلت المكسيك لنهائيات كأس العالم 14 مرة، متفوقة على كل منتخبات الكونكاكاف. أفضل مركز حصلت عليه المكسيك في نهائيات كأس العالم هو المركز السادس الذي نالته في البطولتين اللتين نظمتا في المكسيك 1970 و1986. تعتبر بطولة جنوب أفريقيا 2010 هي المرة الخامسة على التوالي التي يتأهل فيها المكسيكيون إلى نهائيات المونديال. وفي البطولات الأربع السابقة، خرجت من دور الستة عشر. ','http://www.youtube.com/watch?v=eADy9W-l40c'); INSERT INTO "teams" VALUES(25,'Netherlands',4,'هولندا','NED','تأهل المنتخب الهولندي ثماني مرات إلى نهائيات كأس العالم استطاع خلالها الارتقاء في مناسبتين إلى مباراة النهائي في عامي 1974 و1978. كما حل رابعا في كأس العالم فرنسا 1998. توج المنتخب الهولندي بطلا لكأس الأمم الأوروبية 1988. منذ اعتزال النجم رينوس ميشيلس وباستثناء التتويج بكأس الأمم الأروبية 1988، لم يعرف ورثة جيل الأسطورة يوهان كرويف إطلاقا سعادة الفوز في مباراة نهائية. ثمانية انتصارات في ثماني مباريات جعلت المدير الفني الحالي للمنتخب ومدرب فينورد روترادم السابق فان مارجويك يدشن عهدا جديدا حافلا بالإنجازات على رأس التشكيلة الوطنية. ','http://www.youtube.com/watch?v=_pzaLZKdVX0'); INSERT INTO "teams" VALUES(26,'New Zeland',78,'نيوزيلندا','NZL','سبق لمنتخب نيوزيلندا أن شارك في نهائيات كأس العالم مرة واحدة فقط. كان تأهله سنة 1982 أحد أكبر الإنجازات الرياضية في البلد. خسر هذا المنتخب المباريات الثلاث التي خاضتها في أسبانيا سنة 1982. إلا أنه قدم أداءً مشرفاً في مجموعة قوية ضمت أيضا منتخبات البرازيل والاتحاد السوفياتي وسكوتلاندا. تعد نيوزيلندا ثاني عضو في اتحاد أوقيانوسيا يتأهل لنهائيات كأس العالم، بعد أستراليا التي حققت هذا الإنجاز عام 2006. ','http://www.youtube.com/watch?v=soQcIa05HPg'); INSERT INTO "teams" VALUES(27,'Nigeria',21,'نيجيريا','NGA','كان فوز نيجيريا على بلغاريا 3-0 لافتاً في كأس العالم عام 1994 في الولايات المتحدة، ذلك لأن المنتخب الأوروبي نجح بعد ذلك في التفوق على منتخبات اليونان والأرجنتين والمكسيك وألمانيا في تلك البطولة. منذ أن استلم الهولندي كليمنس فيسترهوف تدريب المنتخب النيجيري، تناوب على تدريبه ايضا مدربون مشهورون أمثال جو بونفرير وفيليب تروسييه وبورا ميلوتينوفيتش وبرتي فوجتس. تملك نيجيريا تاريخاً غنياً في بطولات كروية أخرى، حيث فازت بكأس العالم للناشئين اعوام 1985 و1993 و2007، بالإضافة إلى ذهبية دورة الألعاب الأولمبية في اتلانتا. يستطيع المنتخب النيجيري أن يسجل العديد من الأهداف في جنوب أفريقيا بفضل القوة الهجومية الضاربة التي يتمتع بها بوجود مارتينز وياكوبو اييجبيني وبيتر اوديموينجي. ','http://www.youtube.com/watch?v=n7Ano87xpAA'); INSERT INTO "teams" VALUES(28,'Paraguay',31,'الباراجواي','PAR','تمثل جنوب إفريقيا 2010 ثامن مشاركة لمنتخب باراجواي في كأس العالم والرابعة على التوالي بعد ألمانيا 2006 وكوريا\اليابان 2002 وفرنسا 1998. لم يسبق لباراجواي أن فازت في مباراتين في نفس الدورة، كما لم تتجاوز أبدا ثمن النهائي. في مشاركاتها السابقة في المونديال حصدت باراجواي ستة انتصارات وتعادلت سبع مرات وخسرت في تسع مباريات. ','http://www.youtube.com/watch?v=9PX_a6GBssg'); INSERT INTO "teams" VALUES(29,'Portugal',3,'البرتغال','POR','نجح المنتخب البرتغالي في مشاركته الاولى في نهائيات كأس العالم عام 1966 في إحتلال المركز الثالث بقيادة نجمه اوزيبيو الذي توج هدافاً للبطولة. تبقى هذه المشاركة الأفضل للمنتخب البرتغالي في النهائيات. بعد فشله في تخطي دور المجموعات عامي 1986 و2002. إستعاد المنتخب البرتغالي تألقه في كأس العالم في المانيا عام 2006 حيث فاز بالمركز الرابع. تعتبر نهائيات كأس العالم في جنوب أفريقيا 2010 خامس مشاركة للمنتخب البرتغالي. ','http://www.youtube.com/watch?v=yjlhstqOEMs'); INSERT INTO "teams" VALUES(30,'Serbia',15,'الصرب','SRB',' تعتبر دورة جنوب إفريقيا 2010 أول مشاركة للمنتخب الصربي في نهائيات كأس العالم. كانت صربيا جزءاً من يوغوسلافيا السابقة التي شاركت في تسع دورات مونديالية، إضافة إلى صربيا ومونتينيجرو التي خاضت منافسات ألمانيا 2006.','http://www.youtube.com/watch?v=Lg-pxowH-BA'); INSERT INTO "teams" VALUES(31,'Slovakia',34,'سلوفاكيا','SVK','تعتبر نهائيات جنوب أفريقيا 2010 أول مشاركة للمنتخب السلوفاكي في كأس العالم. لكن الجميع يربط التاريخ الكروي لهذا الفريق بالإنجازات التي حققها المنتخب التشيكوسلوفاكي، والذي استطاع الوصول ثماني مرات لنهائيات كأس العالم قبل انقسام البلاد. بل إنه وصل إلى المباراة النهائية في مناسبتين، كانت الأولى عام 1934 وانهزم فيها أمام إيطاليا 1-2 بعد لعب الشوطين الإضافيين، أما الثانية فيرجع تاريخها إلى سنة 1962، عندما انهزم أمام البرازيل 3-1، كما لعب ربع النهائي في دورة إيطاليا 1990. ','http://www.youtube.com/watch?v=5DWTDjdoy0I'); INSERT INTO "teams" VALUES(32,'Slovenia',25,'سلوفينيا','SVN','نظرأ لإستقلالها عن يوجوسلافيا عام 1991، فإن تاريخ سلوفينيا هو الأقصر بين معظم المنتخبات التي تأهلت إلى جنوب أفريقيا 2010. يستطيع المنتخب السلوفيني أن يفخر بأنها المرة الثانية التي يبلغ فيها نهائيات كأس العالم بعد ان بلغ المنتخب الذي كان بقيادة ستريتشكو كاتانيتش نهائيات كأس العالم عام 2002. لا يضم المنتخب السلوفيني في صفوفه أي لاعب نجم. لكن الفريق يعتمد على قوته الجماعية وروحه العالية.','http://www.youtube.com/watch?v=hZet8EqSEwU'); INSERT INTO "teams" VALUES(33,'South Africa',83,'جنوب أفريقيا','RSA','تعتبر المشاركة المقبلة في الهائيات هي الثالثة لجنوب افريقيا في كأس العالم. أول مشاركة كانت في فرنسا 1998، كما تأهل أيضاً إلى نهائيات كوريا الجنوبية واليابان عام 2002. سجل بيني ماكارثي أول هدف لجنوب أفريقيا في نهائيات كأس العالم في المباراة التي إنتهت بتعادل فريقه مع الدنمارك 1-1 في 18 يونيو/حزيران 1998. يعتبر قائد منتخب جنوب أفريقيا الحالي أرون موكوينا أكثر اللاعبين تمثيلاً لمنتخب بلاده. إستضافت جنوب أفريقيا وأحرزت كأس الأمم الأفريقية عام 1996 بفوزها على تونس 2-0 في المباراة النهائية على ملعب سوكر سيتي في جوهانسبورج.','http://www.youtube.com/watch?v=XUDD7Yh2f40'); INSERT INTO "teams" VALUES(34,'Spain',2,'أسبانيا','ESP','شاركت أسبانيا في كأس العالم 12 مرة من قبل. ومنذ بطولة ألمانيا عام 1974 لم تتخلف عن المشاركة. أفضل مركز حققته في كأس العالم هو المركز الرابع، وكان ذلك في البرازيل عام 1950. أنهت أسبانيا مرحلة التصفيات بعشرة انتصارات في عشرة مباريات. سجل المنتخب الأسباني في التصفيات 28 هدفا، وهو بذلك يحتل المركز الثاني كأقوى خط هجوم في أوروبا بعد انجلترا التي تفوقت عليه بستة أهداف. ','http://www.youtube.com/watch?v=z3WtXtNd1aU'); INSERT INTO "teams" VALUES(35,'Switzeerland',24,'سويسرا','SUI','تعتبر نهائيات جنوب أفريقيا 2010 المشاركة التاسعة في كأس العالم بالنسبة للمنتخب السويسري. وصل المنتخب السويسري إلى ربع النهائي في سنوات 1934 و 1938 و1954 وبلغ ثمن النهائي في آخر مشاركة في ألمانيا 2006. يعد أوتمار هيتسفيلد واحدا من أنجح المدربين في أوربا إذ تمكن من الفوز بدوري أبطال أوربا مع ناديين مختلفتين وهو إنجاز شاركه إياه مدرب واحد فقط.','http://www.youtube.com/watch?v=ACNJtDJj_T8'); INSERT INTO "teams" VALUES(36,'Uruguay',16,'أوروجواي','URU','تمثل مشاركة أوروجواي في نهائيات جنوب أفريقيا 2010 المشاركة الـ 11 للمنتخب الوطني في المونديال. نظمت أوروجواي عام 1930 أول نهائيات لكأس العالم وتوجت بلقب البطولة بعد تخطي الأرجنتين في مباراة النهائي بنتيجة 4 – 2. آخر مرة اجتازت فيها أوروجواي ثمن نهائي المونديال كانت في نسخة المكسيك 1970 عندما حلت في المركز الرابع.','http://www.youtube.com/watch?v=2azEO_fabMg'); INSERT INTO "teams" VALUES(37,'USA',14,'الولايات المتحدة الأمريكية','USA','تأهلت الولايات المتحدة إلى نهائيات كأس العالم 9 مرات، ولا يتفوق عليها في عدد مرات التأهل من بين منتخبات الكونكاكاف إلا منتخب المكسيك. حققت الولايات المتحدة أكبر إنجاز لها في كأس العالم في بطولة أوروجواي 1930، عندما خرجت من الدور نصف النهائي. تعتبر بطولة جنوب أفريقيا 2010 المشاركة السادسة على التوالي للفريق الأمريكي في نهائيات المونديال. وكان الفريق قد خرج من الدور الأول في ألمانيا 2006. هداف المنتخب الأمريكي في التصفيات هو جوزي ألتيدور، الذي سجل 6 أهداف.','http://www.youtube.com/watch?v=4pu_FodcSMc'); CREATE TABLE `locations` (`id` integer PRIMARY KEY AUTOINCREMENT, `name` varchar(255), `name_ar` varchar(255), `city_name` varchar(255), `city_name_ar` varchar(255)); INSERT INTO "locations" VALUES(3,'Soccer City','مدينة كرة القدم','Johannesburg','جوهانسبرج'); INSERT INTO "locations" VALUES(4,'Ellis Park Stadium','إيليس بارك','Johannesburg','جوهانسبرج'); INSERT INTO "locations" VALUES(5,'Loftus Versfeld Stadium','لوفتوس فيرسفيلد','Tshwane/Pretoria','تشواني/بريتوريا'); INSERT INTO "locations" VALUES(6,'Peter Mokaba Stadium','بيتر موكابا','Polokwane','بولوكواني'); INSERT INTO "locations" VALUES(7,'Green Point Stadium','جرين بوينت','Cape Town','كايب تاون'); INSERT INTO "locations" VALUES(8,'Royal Bafokeng Stadium','بافوكنج الملكي','Rustenburg','روستنبرج'); INSERT INTO "locations" VALUES(9,'Durban Stadium','ديربان','Durban','ديربان'); INSERT INTO "locations" VALUES(10,'Nelson Mandela Bay Stadium','بورت إليزابيث','Nelson Mandela Bay / Port Elizabeth','نيلسون مانديلا باي/بورت إليزابيث'); INSERT INTO "locations" VALUES(11,'Mbombela Stadium','مبومبيلا','Nelspruit','نيلسبرويت'); INSERT INTO "locations" VALUES(12,'Free State Stadium','فري ستايت','Mangaung / Bloemfontein','مانجاونج / بلومفونتين'); CREATE TABLE "matches"(`id` integer NULL DEFAULT NULL PRIMARY KEY, `group_id` integer NOT NULL DEFAULT NULL, `team_a_id` integer NOT NULL DEFAULT NULL, `team_b_id` integer NOT NULL DEFAULT NULL, `location_id` integer NOT NULL DEFAULT NULL, `start_time` timestamp NULL DEFAULT NULL, `goals_a` integer NULL DEFAULT NULL, `goals_b` integer NULL DEFAULT NULL, `kicks_a` integer NULL DEFAULT NULL, `kicks_b` integer NULL DEFAULT NULL, `youtube_url` string); INSERT INTO "matches" VALUES(2,1,33,24,3,'2010-06-11 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(3,1,36,15,7,'2010-06-11 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(4,2,7,27,4,'2010-06-12 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(5,2,23,18,10,'2010-06-12 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(6,3,14,37,8,'2010-06-12 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(7,3,6,32,6,'2010-06-13 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(8,4,16,8,9,'2010-06-13 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(9,4,30,17,5,'2010-06-13 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(10,5,25,13,3,'2010-06-14 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(11,5,21,10,12,'2010-06-14 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(12,6,20,28,7,'2010-06-14 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(13,6,26,31,8,'2010-06-15 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(14,7,9,22,4,'2010-06-15 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(15,7,12,29,10,'2010-06-15 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(16,8,34,35,9,'2010-06-16 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(17,8,19,11,11,'2010-06-16 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(18,1,33,36,5,'2010-06-16 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(19,1,15,24,6,'2010-06-17 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(20,2,7,23,3,'2010-06-17 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(21,2,18,27,12,'2010-06-17 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(22,3,14,6,7,'2010-06-18 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(23,3,32,37,4,'2010-06-18 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(24,4,16,30,10,'2010-06-18 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(25,4,17,8,8,'2010-06-19 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(26,5,25,21,9,'2010-06-19 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(27,5,10,13,5,'2010-06-19 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(28,6,20,26,11,'2010-06-20 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(29,6,31,28,12,'2010-06-20 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(30,7,9,12,3,'2010-06-20 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(31,7,29,22,7,'2010-06-21 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(32,8,34,19,10,'2010-06-21 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(33,8,11,35,4,'2010-06-21 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(34,1,24,36,8,'2010-06-22 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(35,1,15,33,12,'2010-06-22 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(36,2,18,7,6,'2010-06-22 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(37,2,27,23,9,'2010-06-22 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(38,3,37,6,5,'2010-06-23 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(39,3,32,14,10,'2010-06-23 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(40,4,8,30,11,'2010-06-23 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(41,4,17,16,3,'2010-06-23 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(42,5,13,21,8,'2010-06-24 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(43,5,10,25,7,'2010-06-24 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(44,6,28,26,6,'2010-06-24 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(45,6,31,20,4,'2010-06-24 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(46,7,22,12,11,'2010-06-25 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(47,7,29,9,9,'2010-06-25 16:00:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(48,8,35,19,12,'2010-06-25 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); INSERT INTO "matches" VALUES(49,8,11,34,5,'2010-06-25 20:30:00.000000+0300',NULL,NULL,NULL,NULL,NULL); CREATE TABLE `predictions` (`id` integer PRIMARY KEY AUTOINCREMENT, `match_id` integer NOT NULL, `app_id` varchar(255), `user_id` varchar(255), `goals_a` integer, `goals_b` integer, `kicks_a` integer, `kicks_b` integer, CONSTRAINT `user` FOREIGN KEY (`app_id`, `user_id`) REFERENCES `users`); CREATE TABLE `users` (`app_id` string, `user_id` string, `global_score` integer DEFAULT 64, `first_round_score` integer DEFAULT 48, `round16_score` integer DEFAULT 8, `quarters_score` integer DEFAULT 4, `semis_score` integer DEFAULT 2, `finals_score` integer DEFAULT 2, PRIMARY KEY (`app_id`, `user_id`)); INSERT INTO "users" VALUES(103040546410849,100000899201496,64,48,8,4,2,2); INSERT INTO "users" VALUES(103040546410849,1499202665,64,48,8,4,2,2); INSERT INTO "users" VALUES(110624738982804,750199343,64,48,8,4,2,2); INSERT INTO "users" VALUES(110624738982804,1499202665,64,48,8,4,2,2); INSERT INTO "users" VALUES(110624738982804,100000899201496,64,48,8,4,2,2); INSERT INTO "users" VALUES(110624738982804,745290300,64,48,8,4,2,2); DELETE FROM sqlite_sequence; INSERT INTO "sqlite_sequence" VALUES('groups',13); INSERT INTO "sqlite_sequence" VALUES('teams',37); INSERT INTO "sqlite_sequence" VALUES('locations',12); CREATE INDEX `users_app_id_first_round_score_index` ON `users` (`app_id`, `first_round_score`); CREATE INDEX `users_app_id_round16_score_index` ON `users` (`app_id`, `round16_score`); CREATE INDEX `users_app_id_quarters_score_index` ON `users` (`app_id`, `quarters_score`); CREATE INDEX `users_app_id_semis_score_index` ON `users` (`app_id`, `semis_score`); CREATE INDEX `users_app_id_finals_score_index` ON `users` (`app_id`, `finals_score`); CREATE INDEX `users_app_id_global_score_index` ON `users` (`app_id`, `global_score`); COMMIT; 