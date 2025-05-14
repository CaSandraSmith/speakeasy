from datetime import datetime, timedelta
from models import User, PaymentMethod, Referral, Bundle, Experience, ExperienceImage, Booking, Review, ExperienceSchedule, Tag, Reservation

users = [
    User(first_name='Red', last_name='Ruby', email='red@example.com', password_hash='password1', phone_number='1234567890', admin=False),
    User(first_name='Blue', last_name='Sapphire', email='blue@example.com', password_hash='password2', phone_number='0987654321', admin=False),
    User(first_name='Green', last_name='Emerald', email='green@example.com', password_hash='password3', phone_number='1122334455', admin=False),
    User(first_name='Purple', last_name='Amethyst', email='purple@example.com', password_hash='password4', phone_number='2233445566', admin=False),
    User(first_name='Yellow', last_name='Topaz', email='yellow@example.com', password_hash='password5', phone_number='3344556677', admin=False),
    User(first_name='Orange', last_name='Citrine', email='orange@example.com', password_hash='password6', phone_number='4455667788', admin=False),
    User(first_name='Pink', last_name='Morganite', email='pink@example.com', password_hash='password7', phone_number='5566778899', admin=False),
    User(first_name='Black', last_name='Onyx', email='black@example.com', password_hash='password8', phone_number='6677889900', admin=True),
    User(first_name='White', last_name='Opal', email='white@example.com', password_hash='password9', phone_number='7788990011', admin=False),
    User(first_name='Gray', last_name='Moonstone', email='gray@example.com', password_hash='password10', phone_number='8899001122', admin=False),
]

payment_methods = [
    PaymentMethod(user_id=1, card_number='4111111111111111', cvv='123', billing_zip='90210', exp_month='12', exp_year='2025'),
    PaymentMethod(user_id=2, card_number='4242424242424242', cvv='456', billing_zip='10001', exp_month='06', exp_year='2026'),
    PaymentMethod(user_id=3, card_number='4000056655665556', cvv='789', billing_zip='60601', exp_month='11', exp_year='2024'),
]

referrals = [
    Referral(user_id=1, passcode='ABC123'),
    Referral(user_id=2, passcode='DEF456'),
    Referral(user_id=3, passcode='GHI789'),
]

bundles = [
    # Luxury exclusive bundles
    Bundle(name='Ultimate Space Explorer', description='Complete space tourism package', total_price=55000.00),
    Bundle(name='Ocean Depths Adventure', description='Explore the mysteries of the deep', total_price=280000.00),
    Bundle(name='Arctic Explorer Package', description='Experience the frozen north in luxury', total_price=80000.00),
    Bundle(name='Cultural Heritage Journey', description='Exclusive access to world\'s greatest treasures', total_price=35000.00),
    Bundle(name='Wildlife Conservation Experience', description='Support and interact with endangered species', total_price=140000.00),
    Bundle(name='Extreme Adventure Collection', description='For the ultimate thrill seeker', total_price=75000.00),
    Bundle(name='Culinary World Tour', description='Taste the finest cuisine across continents', total_price=170000.00),
    Bundle(name='Royal Lifestyle Experience', description='Live like royalty around the world', total_price=150000.00),
    Bundle(name='Scientific Discovery Package', description='Behind the scenes of groundbreaking research', total_price=110000.00),
    Bundle(name='Entertainment Insider Access', description='VIP access to entertainment world', total_price=550000.00),
    
    # City packages
    Bundle(name='NYC Adventure', description='Explore the best of New York City with this exciting bundle.', total_price=299.99),
    Bundle(name='LA Experience', description='Discover the glamour and beauty of Los Angeles.', total_price=399.99),
    Bundle(name='Windy City Wonders', description='Experience the charm and culture of Chicago.', total_price=249.99),
]

experiences = [
    # Space & Aviation
    Experience(title='Zero Gravity Space Training', description='Experience astronaut training and zero gravity flight with Space Adventures', location='Star City, Russia', price=24999.99),  # ID: 1
    Experience(title='Black Origin Space Experience', description='11-minute suborbital flight to the edge of space, crossing the Kármán line with several minutes of weightlessness', location='West Texas, USA', price=450000.00),  # ID: 2
    Experience(title='Private SpaceX Launch Viewing', description='VIP access to witness a SpaceX rocket launch with meet & greet with engineers', location='Cape Canaveral, USA', price=15000.00),  # ID: 3
    
    # Underwater Experiences
    Experience(title='Submarine Expedition to Titanic', description='Dive to the Titanic wreck in a private submersible with oceanographers', location='North Atlantic Ocean', price=250000.00),  # ID: 4
    Experience(title='Mermaid Legend Expedition', description='Multi-day luxury yacht journey to explore ancient mermaid legend sites with marine biologists', location='Greek Islands, Mediterranean Sea', price=18000.00),  # ID: 5
    Experience(title='Private Underwater Restaurant', description='Exclusive dining experience 16 feet underwater in the Maldives', location='Conrad Maldives', price=3500.00),  # ID: 6
    
    # Arctic & Antarctic
    Experience(title='North Pole Expedition', description='Reach the geographic North Pole by nuclear icebreaker', location='Arctic Ocean', price=35000.00),  # ID: 7
    Experience(title='Emperor Penguin Safari', description='Private helicopter expedition to remote Emperor penguin colonies', location='Antarctica', price=45000.00),  # ID: 8
    Experience(title='Arctic Ice Hotel Suite', description='Stay in a luxury ice suite with Northern Lights viewing', location='Jukkasjärvi, Sweden', price=2800.00),  # ID: 9
    
    # Extreme Adventures
    Experience(title='Everest Base Camp Helicopter', description='Private helicopter tour to Everest Base Camp with champagne breakfast', location='Nepal', price=7500.00),  # ID: 10
    Experience(title='Volcano Lava Lake Descent', description='Rappel into an active volcano with volcanologists', location='Marum Crater, Vanuatu', price=15000.00),  # ID: 11
    Experience(title='Supersonic Fighter Pilot', description='Fly and control an L-39 fighter jet breaking the sound barrier', location='Las Vegas, USA', price=22000.00),  # ID: 12
    
    # Cultural & Historical
    Experience(title='After Hours Louvre', description='Private evening tour of the Louvre with curator and champagne dinner', location='Paris, France', price=12000.00),  # ID: 13
    Experience(title='Forbidden City Private Access', description='Exclusive access to normally restricted areas with imperial historian', location='Beijing, China', price=8500.00),  # ID: 14
    Experience(title='Vatican Secret Archives', description="Rare access to Vatican's secret archives with personal guide", location='Vatican City', price=15000.00),  # ID: 15
    
    # Wildlife & Safari
    Experience(title='Gorilla Family Adoption', description='Spend a week with researchers and adopt a gorilla family', location='Volcanoes National Park, Rwanda', price=50000.00),  # ID: 16
    Experience(title='Private Island Tiger Reserve', description='Exclusive stay at private tiger conservation island', location='Ranthambore, India', price=18000.00),  # ID: 17
    Experience(title='Whale Migration by Yacht', description='Follow blue whale migration on luxury research vessel', location='Sri Lanka to Antarctica', price=75000.00),  # ID: 18
    
    # Culinary Excellence
    Experience(title='World Chef Tour', description='Private jet tour dining with 10 Michelin star chefs worldwide', location='Global', price=150000.00),  # ID: 19
    Experience(title='Truffle Hunt & Castle Dinner', description='Hunt white truffles with expert and private dinner in Italian castle', location='Alba, Italy', price=12000.00),  # ID: 20
    Experience(title='Underwater Wine Cellar', description='Dive to retrieve aged wine from underwater cellar, followed by tasting', location='Corsica, France', price=8000.00),  # ID: 21
    
    # Entertainment & Celebrity
    Experience(title='Hollywood Movie Set Access', description='Spend a day on set of major Hollywood production as VIP guest', location='Los Angeles, USA', price=25000.00),  # ID: 22
    Experience(title='Formula 1 Driver Experience', description='Drive an actual F1 car with professional training and pit crew', location='Silverstone, UK', price=35000.00),  # ID: 23
    Experience(title='Private Concert Series', description='Commission private performances from Grammy-winning artists', location='Your Choice', price=500000.00),  # ID: 24
    
    # Archaeology & Discovery
    Experience(title='Egyptian Tomb Opening', description='Witness the opening of newly discovered tomb with archaeologists', location='Valley of the Kings, Egypt', price=100000.00),  # ID: 25
    Experience(title='Machu Picchu at Sunrise', description='Private access to Machu Picchu before opening with archaeologist', location='Peru', price=5000.00),  # ID: 26
    Experience(title='Lost City Expedition', description='Join archaeological team searching for lost Mayan city', location='Guatemala Jungle', price=30000.00),  # ID: 27
    
    # Luxury Transport
    Experience(title='Orient Express Full Journey', description='Venice to Istanbul on restored Orient Express with butler service', location='Europe', price=25000.00),  # ID: 28
    Experience(title='Nuclear Submarine Tour', description='Exclusive tour and overnight stay on decommissioned nuclear sub', location='San Diego, USA', price=15000.00),  # ID: 29
    Experience(title='Concorde Flight Simulator', description='Fly the Concorde in professional simulator with retired captain', location='London, UK', price=3500.00),  # ID: 30
    
    # Art & Creativity
    Experience(title='Timeless Brushstrokes: Paint With the Masters', description='Step inside an exclusive studio to co-create art with your favorite artist—past or present—in a once-in-a-lifetime immersive experience', location='London, UK', price=200000.00),  # ID: 31
    Experience(title='Sistine Chapel Restoration', description='Participate in actual restoration work with Vatican conservators', location='Vatican City', price=50000.00),  # ID: 32
    Experience(title='Private Hermitage After Dark', description='Exclusive night tour of Hermitage Museum with curator', location='St. Petersburg, Russia', price=15000.00),  # ID: 33
    
    # Scientific Exploration
    Experience(title='CERN Particle Accelerator', description='Behind-the-scenes tour of Large Hadron Collider with physicists', location='Geneva, Switzerland', price=8000.00),  # ID: 34
    Experience(title='NASA Mission Control', description='Spend a day in Mission Control during active space mission', location='Houston, USA', price=20000.00),  # ID: 35
    Experience(title='Deep Sea Research Mission', description='Join marine biologists on deep sea exploration mission', location='Mariana Trench', price=85000.00),  # ID: 36
    
    # Royal & Nobility
    Experience(title='Scottish Castle Ownership', description='Be lord/lady of Scottish castle for a week with full staff', location='Scottish Highlands', price=50000.00),  # ID: 37
    Experience(title='Royal Palace Dinner', description='Private dinner in Versailles Hall of Mirrors with orchestra', location='Versailles, France', price=30000.00),  # ID: 38
    Experience(title='Monaco Grand Prix Yacht', description="Watch Monaco GP from prince's private yacht with royalty", location='Monte Carlo, Monaco', price=75000.00),  # ID: 39
    
    # Extreme Luxury
    Experience(title='Private Island Buyout', description='Exclusive use of entire private island resort for a week', location='Fiji', price=250000.00),  # ID: 40
    Experience(title='Supersonic Private Jet', description='Cross Atlantic on supersonic business jet prototype', location='New York to London', price=50000.00),  # ID: 41
    Experience(title='Diamond Mine Experience', description='Mine your own diamonds with experts in restricted mine', location='Kimberley, South Africa', price=40000.00),  # ID: 42
    
    # Spiritual & Wellness
    Experience(title='Himalayan Monastery Retreat', description='Live with Buddhist monks in remote monastery for spiritual journey', location='Bhutan', price=12000.00),  # ID: 43
    Experience(title='Ayahuasca with Shaman', description='Traditional ceremony with renowned shaman in Amazon', location='Peru Amazon', price=8000.00),  # ID: 44
    Experience(title='Dead Sea Healing Retreat', description='Private section of Dead Sea with personal healers', location='Jordan', price=15000.00),  # ID: 45
    
    # Film & TV Experiences
    Experience(title='Hollywood Movie Set Access', description='Spend a day on set of major Hollywood production as VIP guest', location='Los Angeles, USA', price=25000.00),  # ID: 46
    Experience(title='James Bond Experience', description='Drive Bond cars, use gadgets with stunt coordinators', location='London, UK', price=25000.00),  # ID: 47
    Experience(title='Star Wars Set Visit', description='Visit active Star Wars production with meet & greet', location='Pinewood Studios, UK', price=30000.00),  # ID: 48
    
    # Rare Access
    Experience(title='Area 51 Perimeter Tour', description='Closest legal access to Area 51 with former military guide', location='Nevada, USA', price=5000.00),  # ID: 49
    Experience(title='Chernobyl Exclusion Zone', description='Private tour of Chernobyl with nuclear physicist', location='Pripyat, Ukraine', price=8000.00),  # ID: 50
    Experience(title='North Korea Luxury Tour', description='Exclusive access to areas rarely seen by outsiders', location='Pyongyang, North Korea', price=15000.00),  # ID: 51
    
    # Music & Performance
    Experience(title='La Scala Private Box', description='Private box for season at La Scala with backstage access', location='Milan, Italy', price=50000.00),  # ID: 52
    Experience(title='Broadway Show Takeover', description='Rent entire Broadway theater for private performance', location='New York, USA', price=100000.00),  # ID: 53
    Experience(title='Abbey Road Recording', description='Record at Abbey Road Studios with famous producer', location='London, UK', price=25000.00),  # ID: 54
]

experience_images = [
    ExperienceImage(experience_id=1, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746471082/zero-gravity_kvgjhz.jpg'),
    ExperienceImage(experience_id=2, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746471087/space-flight_fy2wxe.jpg'),
    ExperienceImage(experience_id=3, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746471082/spacex-launch_oz2ufa.jpg'),
    ExperienceImage(experience_id=4, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746471086/titanic-sub_cvzyjy.jpg'),
    ExperienceImage(experience_id=5, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746471083/mermaid_b5yju6.jpg'),
    ExperienceImage(experience_id=6, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746471083/underwater-wine_tbj6wm.jpg'),
    ExperienceImage(experience_id=7, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746477658/north-pole_aqdcly.jpg'),
    ExperienceImage(experience_id=8, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746477656/emperor-penguins_te7ntp.jpg'),
    ExperienceImage(experience_id=9, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746477657/ice-hotel_wpdi6s.jpg'),
    ExperienceImage(experience_id=10, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746471081/everest-helicopter_idvchu.jpg'),
    ExperienceImage(experience_id=11, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746471084/volcano-descent_qwdegg.jpg'),
    ExperienceImage(experience_id=12, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746471080/fighter-jet_gx8flc.jpg'),
    ExperienceImage(experience_id=13, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746477654/louvre-night_lcpoeq.jpg'),
    ExperienceImage(experience_id=14, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746477652/forbidden-city_mqfsjb.jpg'),
    ExperienceImage(experience_id=15, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746477649/vatican-archives_upk1p1.jpg'),
    ExperienceImage(experience_id=16, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746472372/gorilla-family_yzbljt.jpg'),
    ExperienceImage(experience_id=17, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746477651/tiger-island_teabe9.jpg'),
    ExperienceImage(experience_id=18, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746477929/whale-yacht_fwoltg.jpg'),
    ExperienceImage(experience_id=19, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746477931/chef-tour_ljjsvm.jpg'),
    ExperienceImage(experience_id=20, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746477925/truffle-hunt_e5hmp0.jpg'),
    ExperienceImage(experience_id=21, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746471083/underwater-wine_tbj6wm.jpg'),
    ExperienceImage(experience_id=22, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746471081/movie-set_igmoa5.jpg'),
    ExperienceImage(experience_id=23, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746471084/f1-car_gpei8i.jpg'),
    ExperienceImage(experience_id=24, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746471081/private-concert_qoamru.jpg'),
    ExperienceImage(experience_id=25, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746471085/egypt-tomb_mwbp7f.jpg'),
    ExperienceImage(experience_id=26, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746477928/machu-picchu_y6l1pl.jpg'),
    ExperienceImage(experience_id=27, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746477926/lost-city_f3bfgi.jpg'),
    ExperienceImage(experience_id=28, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746480783/orient-express_jbhmjv.jpg'),
    ExperienceImage(experience_id=29, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746479293/submarine_picehi.jpg'),
    ExperienceImage(experience_id=30, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746479291/concorde_bwksjy.jpg'),
    ExperienceImage(experience_id=31, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746471086/art-studio_qic3i8.jpg'),
    ExperienceImage(experience_id=32, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746479290/sistine-chapel_wsaf8b.jpg'),
    ExperienceImage(experience_id=33, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746480781/hermitage_xroyzw.jpg'),
    ExperienceImage(experience_id=34, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746480779/cern_njp0km.jpg'),
    ExperienceImage(experience_id=35, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746480777/mission-control_zwosoh.jpg'),
    ExperienceImage(experience_id=36, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746480776/deep-sea_xgbpwl.jpg'),
    ExperienceImage(experience_id=37, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746484611/scottish-castle_cc1c3e.jpg'),
    ExperienceImage(experience_id=38, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746484605/versailles_oshpj2.jpg'),
    ExperienceImage(experience_id=39, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746484609/monaco-yacht_f1cum6.jpg'),
    ExperienceImage(experience_id=40, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746484603/private-island_t22q6z.jpg'),
    ExperienceImage(experience_id=41, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746484607/supersonic-jet_iu15x1.jpg'),
    ExperienceImage(experience_id=42, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746484601/diamond-mine_ptnluo.jpg'),
    ExperienceImage(experience_id=43, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746484599/monastery_lxsv0y.jpg'),
    ExperienceImage(experience_id=44, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746484947/amazon-shaman_rtyw0q.jpg'),
    ExperienceImage(experience_id=45, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746484597/dead-sea_t5hu8c.jpg'),
    ExperienceImage(experience_id=46, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746471081/movie-set_igmoa5.jpg'),
    ExperienceImage(experience_id=47, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746471081/james-bond_kwanl7.jpg'),
    ExperienceImage(experience_id=48, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746484595/star-wars_vcebwu.jpg'),
    ExperienceImage(experience_id=49, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746484592/area-51_kfmp0z.jpg'),
    ExperienceImage(experience_id=50, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746484594/chernobyl_izgxwj.jpg'),
    ExperienceImage(experience_id=51, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746484590/north-korea_tqfhjc.jpg'),
    ExperienceImage(experience_id=52, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746484586/la-scala_thn1p0.jpg'),
    ExperienceImage(experience_id=53, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746484589/broadway_xoly08.jpg'),
    ExperienceImage(experience_id=54, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1746484587/abbey-road_dow2gb.jpg'),
    
    # Adding images for the regular experiences (from first file)
    ExperienceImage(experience_id=19, image_url='https://media.istockphoto.com/id/1526986072/photo/airplane-flying-over-tropical-sea-at-sunset.jpg?s=612x612&w=0&k=20&c=Ccvg3BqlqsWTT0Mt0CvHlbwCuRjPAIWaCLMKSl3PCks='),
    ExperienceImage(experience_id=17, image_url='https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJhdmVsfGVufDB8fDB8fHww'),
    ExperienceImage(experience_id=19, image_url='https://media.self.com/photos/5f0885ffef7a10ffa6640daa/1:1/w_3929,h_3929,c_limit/travel_plane_corona.jpeg'),
    ExperienceImage(experience_id=19, image_url='https://static.vecteezy.com/system/resources/thumbnails/037/248/582/small/ai-generated-travelling-to-thailand-advertisment-background-with-copy-space-free-photo.jpg'),
    
    # More space flight
    ExperienceImage(experience_id=2, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1747196051/space-flight-2_mmkti4.jpg'),
    ExperienceImage(experience_id=2, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1747196050/space-flight-3_dx9fr8.jpg'),
    
    # More Submarine
    ExperienceImage(experience_id=4, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1747196050/titanic-sub-2_knmly8.jpg'),
    ExperienceImage(experience_id=4, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1747196050/titanic-sub-4_xipoc6.jpg'),
    ExperienceImage(experience_id=4, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1747196050/titanic-sub-3_xrvvwg.jpg'),
    
    # More penguins
    ExperienceImage(experience_id=8, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1747196050/emperor-penguins-3_n6ap3p.jpg'),
    ExperienceImage(experience_id=8, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1747196050/emperor-penguins-2_e4okcr.jpg'),
    ExperienceImage(experience_id=8, image_url='https://res.cloudinary.com/dr1k9hles/image/upload/v1747196051/emperor-penguins-4_afyd8p.jpg'),
]

bookings = [
    Booking(user_id=1, experience_id=1, number_of_guests=2, confirmation_code='CONFIRM123'),
    Booking(user_id=2, experience_id=3, number_of_guests=1, confirmation_code='CONFIRM456'),
    Booking(user_id=3, experience_id=5, number_of_guests=3, confirmation_code='CONFIRM789'),

    # Additional bookings with most for user_id=1
    Booking(user_id=1, experience_id=4, number_of_guests=2, confirmation_code='CONFIRM111'),
    Booking(user_id=1, experience_id=6, number_of_guests=1, confirmation_code='CONFIRM112'),
    Booking(user_id=1, experience_id=8, number_of_guests=4, confirmation_code='CONFIRM113'),
    Booking(user_id=1, experience_id=10, number_of_guests=2, confirmation_code='CONFIRM114'),
    Booking(user_id=1, experience_id=12, number_of_guests=3, confirmation_code='CONFIRM115'),
    Booking(user_id=1, experience_id=14, number_of_guests=2, confirmation_code='CONFIRM116'),
    Booking(user_id=1, experience_id=16, number_of_guests=1, confirmation_code='CONFIRM117'),

    Booking(user_id=2, experience_id=2, number_of_guests=2, confirmation_code='CONFIRM201'),
    Booking(user_id=3, experience_id=7, number_of_guests=1, confirmation_code='CONFIRM202'),
    Booking(user_id=2, experience_id=9, number_of_guests=4, confirmation_code='CONFIRM203'),
    Booking(user_id=3, experience_id=11, number_of_guests=2, confirmation_code='CONFIRM204'),
    Booking(user_id=1, experience_id=13, number_of_guests=3, confirmation_code='CONFIRM205'),
]

def days_ago(n):
    return datetime.now() - timedelta(days=n)

reviews = [
    Review(user_id=2, experience_id=1, rating=5, comment='One of the best adventures of my life.', timestamp=days_ago(5)),
    Review(user_id=3, experience_id=1, rating=4, comment='Truly breathtaking, but a bit pricey.', timestamp=days_ago(7)),
    Review(user_id=7, experience_id=2, rating=5, comment='Felt like floating above Earth. Surreal.', timestamp=days_ago(8)),
    Review(user_id=5, experience_id=2, rating=4, comment='Very cool but the prep took a while.', timestamp=days_ago(6)),
    Review(user_id=5, experience_id=3, rating=3, comment='Nice, but the group was too large.', timestamp=days_ago(3)),
    Review(user_id=6, experience_id=3, rating=4, comment='Great guide and views! Bring good shoes.', timestamp=days_ago(9)),
    Review(user_id=7, experience_id=4, rating=5, comment='Scuba through ruins was unforgettable.', timestamp=days_ago(12)),
    Review(user_id=8, experience_id=4, rating=4, comment='Awesome views but the descent was tough.', timestamp=days_ago(10)),
    Review(user_id=9, experience_id=5, rating=4, comment='Smooth sailing and beautiful sunsets.', timestamp=days_ago(11)),
    Review(user_id=10, experience_id=5, rating=5, comment='Felt like royalty the whole time.', timestamp=days_ago(13)),
    Review(user_id=4, experience_id=2, rating=5, comment='Absolutely out of this world! A dream come true.', timestamp=datetime.now() - timedelta(days=10)),
    Review(user_id=5, experience_id=4, rating=4, comment='Fascinating dive! A bit claustrophobic but worth it.', timestamp=datetime.now() - timedelta(days=8)),
    Review(user_id=6, experience_id=6, rating=5, comment='The underwater view was magical. Incredible food too!', timestamp=datetime.now() - timedelta(days=15)),
    Review(user_id=7, experience_id=7, rating=3, comment='Cold but beautiful. Expected more adventure.', timestamp=datetime.now() - timedelta(days=12)),
    Review(user_id=8, experience_id=8, rating=5, comment='Penguins were adorable. Once in a lifetime!', timestamp=datetime.now() - timedelta(days=6)),
    Review(user_id=9, experience_id=9, rating=4, comment='Cozy and scenic. The ice suite was surreal.', timestamp=datetime.now() - timedelta(days=4)),
    Review(user_id=10, experience_id=10, rating=5, comment='Helicopter ride was thrilling and views were unmatched.', timestamp=datetime.now() - timedelta(days=20)),
    Review(user_id=1, experience_id=11, rating=4, comment='Volcano descent was intense! Guides were pros.', timestamp=days_ago(18)),
    Review(user_id=2, experience_id=12, rating=5, comment='Breaking the sound barrier was unforgettable!', timestamp=days_ago(25)),
    Review(user_id=3, experience_id=13, rating=5, comment='The Louvre at night felt like a movie. Priceless.', timestamp=days_ago(30)),
    Review(user_id=4, experience_id=14, rating=3, comment='Very informative but not as exclusive as expected.', timestamp=days_ago(2)),
    Review(user_id=5, experience_id=15, rating=4, comment='The archives tour was mysterious and amazing.', timestamp=days_ago(11)),
    Review(user_id=6, experience_id=17, rating=5, comment='The tigers and scenery were breathtaking.', timestamp=days_ago(14)),
    Review(user_id=7, experience_id=19, rating=5, comment='Every meal was perfection. World-class chefs!', timestamp=days_ago(7)),
    Review(user_id=8, experience_id=21, rating=4, comment='Tasting underwater wine? Yes, please.', timestamp=days_ago(5)),
    Review(user_id=9, experience_id=23, rating=5, comment='Driving an F1 car was my childhood dream. Loved it.', timestamp=days_ago(3)),
    Review(user_id=10, experience_id=26, rating=4, comment='Private Machu Picchu tour was magical.', timestamp=days_ago(9)),
    Review(user_id=1, experience_id=28, rating=5, comment='Luxury on rails. Couldn’t stop staring out the window.', timestamp=days_ago(13)),
    Review(user_id=2, experience_id=30, rating=3, comment='Cool but shorter than I hoped.', timestamp=days_ago(6)),
    Review(user_id=3, experience_id=35, rating=5, comment='NASA control center was beyond inspiring.', timestamp=days_ago(1)),
    Review(user_id=6, experience_id=7, rating=5, comment="Polar bears, ice fields, and champagne. Unreal.", timestamp=days_ago(10)),
    Review(user_id=7, experience_id=9, rating=3, comment="Beautiful views but hotel was too cold for me.", timestamp=days_ago(15)),
    Review(user_id=8, experience_id=11, rating=4, comment="Adrenaline rush like no other. Volcano was intense.", timestamp=days_ago(1)),
    Review(user_id=9, experience_id=12, rating=5, comment="Flying a fighter jet was a dream. Instructors were excellent.", timestamp=days_ago(3)),
    Review(user_id=10, experience_id=14, rating=5, comment="Deep dive into Chinese history. Loved the access.", timestamp=days_ago(7)),
    Review(user_id=1, experience_id=15, rating=4, comment="The archives were fascinating, but I wanted more time.", timestamp=days_ago(9)),
    Review(user_id=2, experience_id=17, rating=5, comment="Tiger conservation up close! Felt meaningful and luxurious.", timestamp=days_ago(4)),
    Review(user_id=3, experience_id=18, rating=3, comment="Whales were hard to spot. Crew tried their best.", timestamp=days_ago(8)),
    Review(user_id=4, experience_id=20, rating=5, comment="Truffle dinner was exquisite. Truly magical.", timestamp=days_ago(11)),
    Review(user_id=5, experience_id=21, rating=4, comment="Unique underwater tasting. Would love to do it again.", timestamp=days_ago(6)),
    Review(user_id=6, experience_id=22, rating=5, comment="Walking a movie set was unreal. A-list treatment!", timestamp=days_ago(14)),
    Review(user_id=7, experience_id=23, rating=5, comment="Fastest I've ever gone. Insane experience!", timestamp=days_ago(20)),
    Review(user_id=8, experience_id=24, rating=5, comment="Private concert with my favorite artist. I'm still crying.", timestamp=days_ago(18)),
    Review(user_id=9, experience_id=26, rating=4, comment="Perfect sunrise. Peaceful and moving.", timestamp=days_ago(12)),
    Review(user_id=10, experience_id=28, rating=5, comment="Orient Express is like stepping back in time. Luxurious.", timestamp=days_ago(16)),
    Review(user_id=1, experience_id=29, rating=4, comment="Submarine tour was fascinating. A bit cramped though.", timestamp=days_ago(19)),
    Review(user_id=2, experience_id=31, rating=5, comment="Painting with the masters blew my mind. 100% recommended.", timestamp=days_ago(22)),
    Review(user_id=3, experience_id=32, rating=5, comment="Actually helping restore history was incredible.", timestamp=days_ago(25)),
    Review(user_id=4, experience_id=33, rating=4, comment="The Hermitage after dark is pure romance and awe.", timestamp=days_ago(23)),
    Review(user_id=5, experience_id=34, rating=4, comment="Fascinating physics! Could've used more interactive time.", timestamp=days_ago(17)),
    Review(user_id=6, experience_id=35, rating=5, comment="Mission Control during a launch was next-level!", timestamp=days_ago(13)),
    Review(user_id=7, experience_id=36, rating=5, comment="Deep sea life is mind-blowing. Felt like a scientist!", timestamp=days_ago(21)),
    Review(user_id=8, experience_id=37, rating=5, comment="I was literally royalty for a week. Unreal.", timestamp=days_ago(24)),
    Review(user_id=9, experience_id=38, rating=4, comment="Versailles dinner was regal but service a bit slow.", timestamp=days_ago(26)),
    Review(user_id=10, experience_id=39, rating=5, comment="GP from the prince's yacht... No words.", timestamp=days_ago(28)),
    Review(user_id=1, experience_id=41, rating=4, comment="Jet ride was loud but fast and slick.", timestamp=days_ago(29)),
    Review(user_id=2, experience_id=43, rating=5, comment="Life-changing retreat. Gained deep inner peace.", timestamp=days_ago(30)),
    Review(user_id=3, experience_id=45, rating=4, comment="Healing, relaxing. Not much nightlife.", timestamp=days_ago(27)),
]

experience_schedules = [
    # Fixed schedules for rare/seasonal opportunities
    ExperienceSchedule(experience_id=1, start_date='2025-07-15', end_date='2025-07-15', recurring_pattern='None', days_of_week=None, start_time='06:00:00', end_time='18:00:00'),
    ExperienceSchedule(experience_id=4, start_date='2025-08-01', end_date='2025-08-07', recurring_pattern='None', days_of_week=None, start_time='00:00:00', end_time='23:59:00'),
    ExperienceSchedule(experience_id=7, start_date='2025-06-20', end_date='2025-07-05', recurring_pattern='None', days_of_week=None, start_time='00:00:00', end_time='23:59:00'),
    ExperienceSchedule(experience_id=8, start_date='2025-11-01', end_date='2025-11-30', recurring_pattern='None', days_of_week=None, start_time='00:00:00', end_time='23:59:00'),
    ExperienceSchedule(experience_id=18, start_date='2025-12-01', end_date='2026-03-31', recurring_pattern='None', days_of_week=None, start_time='00:00:00', end_time='23:59:00'),
    ExperienceSchedule(experience_id=25, start_date='2025-09-15', end_date='2025-09-15', recurring_pattern='None', days_of_week=None, start_time='05:00:00', end_time='20:00:00'),
    ExperienceSchedule(experience_id=39, start_date='2025-05-22', end_date='2025-05-25', recurring_pattern='None', days_of_week=None, start_time='00:00:00', end_time='23:59:00'),
    ExperienceSchedule(experience_id=2, start_date='2025-06-01', end_date='2025-12-31', recurring_pattern='Monthly', days_of_week=None, start_time='10:00:00', end_time='11:00:00'),
    
    # Flexible schedules (customer chooses dates)
    ExperienceSchedule(experience_id=3, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=5, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=6, start_date=None, end_date=None, recurring_pattern='Daily', days_of_week=None, start_time='19:00:00', end_time='22:00:00'),
    ExperienceSchedule(experience_id=9, start_date='2025-12-01', end_date='2026-03-31', recurring_pattern='Weekly', days_of_week='Friday,Saturday,Sunday', start_time=None, end_time=None),
    ExperienceSchedule(experience_id=10, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=11, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=12, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=13, start_date=None, end_date=None, recurring_pattern='Weekly', days_of_week='Tuesday,Thursday', start_time='19:00:00', end_time='23:00:00'),
    ExperienceSchedule(experience_id=14, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=15, start_date=None, end_date=None, recurring_pattern='Monthly', days_of_week=None, start_time='09:00:00', end_time='17:00:00'),
    ExperienceSchedule(experience_id=16, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=17, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=19, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=20, start_date='2025-10-01', end_date='2025-11-30', recurring_pattern='Weekly', days_of_week='Saturday,Sunday', start_time='06:00:00', end_time='20:00:00'),
    ExperienceSchedule(experience_id=21, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=22, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=23, start_date=None, end_date=None, recurring_pattern='Weekly', days_of_week='Wednesday,Saturday', start_time='09:00:00', end_time='18:00:00'),
    ExperienceSchedule(experience_id=24, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=26, start_date=None, end_date=None, recurring_pattern='Daily', days_of_week=None, start_time='05:00:00', end_time='09:00:00'),
    ExperienceSchedule(experience_id=27, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=28, start_date=None, end_date=None, recurring_pattern='Weekly', days_of_week='Friday', start_time='14:00:00', end_time=None),
    ExperienceSchedule(experience_id=29, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=30, start_date=None, end_date=None, recurring_pattern='Weekly', days_of_week='Tuesday,Thursday,Saturday', start_time='10:00:00', end_time='16:00:00'),
    ExperienceSchedule(experience_id=31, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=32, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=33, start_date=None, end_date=None, recurring_pattern='Weekly', days_of_week='Thursday', start_time='18:00:00', end_time='22:00:00'),
    ExperienceSchedule(experience_id=34, start_date=None, end_date=None, recurring_pattern='Monthly', days_of_week=None, start_time='09:00:00', end_time='17:00:00'),
    ExperienceSchedule(experience_id=35, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=36, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=37, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=38, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=40, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=41, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=42, start_date=None, end_date=None, recurring_pattern='Weekly', days_of_week='Monday,Wednesday,Friday', start_time='08:00:00', end_time='17:00:00'),
    ExperienceSchedule(experience_id=43, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=44, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=45, start_date=None, end_date=None, recurring_pattern='Daily', days_of_week=None, start_time='06:00:00', end_time='20:00:00'),
    ExperienceSchedule(experience_id=46, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=47, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=48, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    ExperienceSchedule(experience_id=49, start_date=None, end_date=None, recurring_pattern='Weekly', days_of_week='Friday,Saturday', start_time='06:00:00', end_time='18:00:00'),
    ExperienceSchedule(experience_id=50, start_date=None, end_date=None, recurring_pattern='Custom', days_of_week=None, start_time=None, end_time=None),
    
    # Regular experience schedules (from first file)
    ExperienceSchedule(experience_id=51, start_date='2025-05-01', end_date='2025-05-01', recurring_pattern='None', days_of_week='Monday, Wednesday, Friday', start_time='09:00:00', end_time='11:00:00'),
    ExperienceSchedule(experience_id=52, start_date='2025-05-02', end_date='2025-05-02', recurring_pattern='None', days_of_week='Tuesday, Thursday', start_time='14:00:00', end_time='16:00:00'),
    ExperienceSchedule(experience_id=53, start_date='2025-05-03', end_date='2025-05-03', recurring_pattern='None', days_of_week='Wednesday, Saturday', start_time='10:00:00', end_time='12:00:00'),
    ExperienceSchedule(experience_id=54, start_date='2025-05-04', end_date='2025-05-04', recurring_pattern='None', days_of_week='Monday, Friday', start_time='08:00:00', end_time='10:00:00'),
]

reservations = [
    # Fixed-date experiences
    Reservation(booking_id=1, date='2025-07-15', time_slot='09:00:00', status='confirmed'),
    Reservation(booking_id=4, date='2025-08-03', time_slot='14:00:00', status='confirmed'),
    Reservation(booking_id=12, date='2025-06-25', time_slot='12:00:00', status='confirmed'),
    Reservation(booking_id=6, date='2025-11-15', time_slot='13:00:00', status='confirmed'),

    # Flexible or custom-pattern experiences
    Reservation(booking_id=2, date='2025-01-21', time_slot='11:00:00', status='confirmed'),
    Reservation(booking_id=3, date='2025-10-08', time_slot='15:30:00', status='confirmed'),
    Reservation(booking_id=5, date='2025-04-30', time_slot='19:30:00', status='confirmed'),
    Reservation(booking_id=7, date='2024-12-15', time_slot='17:00:00', status='confirmed'),
    Reservation(booking_id=8, date='2025-10-06', time_slot='18:00:00', status='confirmed'),
    Reservation(booking_id=9, date='2024-12-19', time_slot='10:00:00', status='confirmed'),
    Reservation(booking_id=10, date='2025-07-20', time_slot='20:00:00', status='confirmed'),

    # Scheduled (patterned) experiences
    Reservation(booking_id=11, date='2025-10-02', time_slot='10:00:00', status='confirmed'),
    Reservation(booking_id=13, date='2025-12-06', time_slot='14:00:00', status='confirmed'),
    Reservation(booking_id=14, date='2025-01-02', time_slot='13:00:00', status='confirmed'),
    Reservation(booking_id=15, date='2024-12-03', time_slot='19:00:00', status='confirmed'),
]


tags = [
    Tag(name='Exclusive Access', description='Access to normally restricted areas'), #1
    Tag(name='Once in a Lifetime', description='Rare opportunities that may never come again'), #2
    Tag(name='Adventure', description='Thrilling and adventurous experiences'), #3
    Tag(name='Luxury', description='Ultra-premium experiences with exceptional service'), #4
    Tag(name='Educational', description='Learn from world experts'), #5
    Tag(name='Cultural', description='Deep cultural immersion'),  #6
    Tag(name='Wildlife', description='Close encounters with rare animals'), #7
    Tag(name='Space', description='Space and aviation experiences'), #8
    Tag(name='Ocean', description='Marine and underwater experiences'), #9
    Tag(name='Extreme', description='Pushing physical and mental limits'), #10
    Tag(name='Culinary', description='Exceptional food and wine experiences'), #11
    Tag(name='Historical', description='Access to historical sites and artifacts'), #12
    Tag(name='Celebrity', description='Meet famous personalities'), #13
    Tag(name='Scientific', description='Cutting-edge science and technology'), #14
    Tag(name='Spiritual', description='Transformative spiritual journeys'), #15
    Tag(name='Featured Deals', description="Featured Experiences"), #16
    Tag(name='Museum', description='Experiences focused on art and museum tours'), #17
    Tag(name='Entertainment', description='Experiences focusing on entertainment'), #18
    Tag(name='Scenic', description='Experiences offering scenic views or routes'), #19
    Tag(name='Outdoor', description='Experiences that take place outdoors'), #20
]

# The luxury bundle experiences (from second file)
bundle_experiences = [
    # Ultimate Space Explorer
    {'bundle_id': 1, 'experience_id': 1},  # Zero Gravity
    {'bundle_id': 1, 'experience_id': 2},  # Edge of Space
    {'bundle_id': 1, 'experience_id': 3},  # SpaceX Launch
    
    # Ocean Depths Adventure
    {'bundle_id': 2, 'experience_id': 4},  # Titanic
    {'bundle_id': 2, 'experience_id': 5},  # Mermaid Expedition
    {'bundle_id': 2, 'experience_id': 6},  # Underwater Restaurant
    {'bundle_id': 2, 'experience_id': 21}, # Underwater Wine
    
    # Arctic Explorer Package
    {'bundle_id': 3, 'experience_id': 7},  # North Pole
    {'bundle_id': 3, 'experience_id': 8},  # Emperor Penguins
    {'bundle_id': 3, 'experience_id': 9},  # Ice Hotel
    
    # Cultural Heritage Journey
    {'bundle_id': 4, 'experience_id': 13}, # Louvre
    {'bundle_id': 4, 'experience_id': 14}, # Forbidden City
    {'bundle_id': 4, 'experience_id': 15}, # Vatican Archives
    
    # Wildlife Conservation Experience
    {'bundle_id': 5, 'experience_id': 16}, # Gorilla Family
    {'bundle_id': 5, 'experience_id': 17}, # Tiger Reserve
    {'bundle_id': 5, 'experience_id': 18}, # Whale Migration
    
    # Extreme Adventure Collection
    {'bundle_id': 6, 'experience_id': 10}, # Everest Helicopter
    {'bundle_id': 6, 'experience_id': 11}, # Volcano Descent
    {'bundle_id': 6, 'experience_id': 12}, # Supersonic Fighter
    {'bundle_id': 6, 'experience_id': 23}, # F1 Driver
    
    # Culinary World Tour
    {'bundle_id': 7, 'experience_id': 19}, # World Chef Tour
    {'bundle_id': 7, 'experience_id': 20}, # Truffle Hunt
    {'bundle_id': 7, 'experience_id': 21}, # Underwater Wine
    
    # Royal Lifestyle Experience
    {'bundle_id': 8, 'experience_id': 37}, # Scottish Castle
    {'bundle_id': 8, 'experience_id': 38}, # Versailles Dinner
    {'bundle_id': 8, 'experience_id': 39}, # Monaco GP Yacht
    
    # Scientific Discovery Package
    {'bundle_id': 9, 'experience_id': 34}, # CERN
    {'bundle_id': 9, 'experience_id': 35}, # NASA Mission Control
    {'bundle_id': 9, 'experience_id': 36}, # Deep Sea Research
    
    # Entertainment Insider Access
    {'bundle_id': 10, 'experience_id': 22}, # Movie Set
    {'bundle_id': 10, 'experience_id': 24}, # Private Concert
    {'bundle_id': 10, 'experience_id': 47}, # James Bond
    {'bundle_id': 10, 'experience_id': 48}, # Star Wars
]

experience_tags = [
    # Space experiences (1-3)
    {'experience_id': 1, 'tag_id': 8},   # Space
    {'experience_id': 1, 'tag_id': 5},   # Educational
    {'experience_id': 1, 'tag_id': 3},   # Adventure
    {'experience_id': 2, 'tag_id': 8},   # Space
    {'experience_id': 2, 'tag_id': 10},  # Extreme
    {'experience_id': 2, 'tag_id': 1},   # Exclusive Access 
    {'experience_id': 3, 'tag_id': 8},   # Space
    {'experience_id': 3, 'tag_id': 1},   # Exclusive Access
    {'experience_id': 3, 'tag_id': 14},  # Scientific
    
    # Ocean experiences (4-6)
    {'experience_id': 4, 'tag_id': 9},   # Ocean
    {'experience_id': 4, 'tag_id': 2},   # Once in a Lifetime
    {'experience_id': 4, 'tag_id': 12},  # Historical
    {'experience_id': 4, 'tag_id': 1},   # Exclusive Access 
    {'experience_id': 5, 'tag_id': 9},   # Ocean
    {'experience_id': 5, 'tag_id': 7},   # Wildlife
    {'experience_id': 5, 'tag_id': 3},   # Adventure
    {'experience_id': 6, 'tag_id': 9},   # Ocean
    {'experience_id': 6, 'tag_id': 11},  # Culinary
    {'experience_id': 6, 'tag_id': 4},   # Luxury
    
    # Arctic experiences (7-9)
    {'experience_id': 7, 'tag_id': 2},   # Once in a Lifetime
    {'experience_id': 7, 'tag_id': 10},  # Extreme
    {'experience_id': 7, 'tag_id': 3},   # Adventure
    {'experience_id': 8, 'tag_id': 7},   # Wildlife
    {'experience_id': 8, 'tag_id': 2},   # Once in a Lifetime
    {'experience_id': 8, 'tag_id': 3},   # Adventure
    {'experience_id': 9, 'tag_id': 4},   # Luxury
    {'experience_id': 9, 'tag_id': 1},   # Exclusive Access
    
    # Extreme adventures (10-12)
    {'experience_id': 10, 'tag_id': 3},  # Adventure
    {'experience_id': 10, 'tag_id': 4},  # Luxury
    {'experience_id': 11, 'tag_id': 10}, # Extreme
    {'experience_id': 11, 'tag_id': 2},  # Once in a Lifetime
    {'experience_id': 11, 'tag_id': 14}, # Scientific
    {'experience_id': 12, 'tag_id': 10}, # Extreme
    {'experience_id': 12, 'tag_id': 3},  # Adventure
    {'experience_id': 12, 'tag_id': 8},  # Space
    
    # Cultural experiences (13-15)
    {'experience_id': 13, 'tag_id': 6},  # Cultural
    {'experience_id': 13, 'tag_id': 1},  # Exclusive Access
    {'experience_id': 13, 'tag_id': 12}, # Historical
    {'experience_id': 14, 'tag_id': 6},  # Cultural
    {'experience_id': 14, 'tag_id': 12}, # Historical
    {'experience_id': 14, 'tag_id': 1},  # Exclusive Access
    {'experience_id': 15, 'tag_id': 6},  # Cultural
    {'experience_id': 15, 'tag_id': 1},  # Exclusive Access
    {'experience_id': 15, 'tag_id': 2},  # Once in a Lifetime
    
    # Wildlife experiences (16-18)
    {'experience_id': 16, 'tag_id': 7},  # Wildlife
    {'experience_id': 16, 'tag_id': 2},  # Once in a Lifetime
    {'experience_id': 16, 'tag_id': 5},  # Educational
    {'experience_id': 17, 'tag_id': 7},  # Wildlife
    {'experience_id': 17, 'tag_id': 4},  # Luxury
    {'experience_id': 17, 'tag_id': 1},  # Exclusive Access
    {'experience_id': 18, 'tag_id': 7},  # Wildlife
    {'experience_id': 18, 'tag_id': 14}, # Scientific
    {'experience_id': 18, 'tag_id': 9},  # Ocean
    
    # Culinary experiences (19-21)
    {'experience_id': 19, 'tag_id': 11}, # Culinary
    {'experience_id': 19, 'tag_id': 4},  # Luxury
    {'experience_id': 19, 'tag_id': 13}, # Celebrity
    {'experience_id': 20, 'tag_id': 11}, # Culinary
    {'experience_id': 20, 'tag_id': 6},  # Cultural
    {'experience_id': 20, 'tag_id': 4},  # Luxury
    {'experience_id': 21, 'tag_id': 11}, # Culinary
    {'experience_id': 21, 'tag_id': 9},  # Ocean
    {'experience_id': 21, 'tag_id': 3},  # Adventure
    
    # Entertainment experiences (22-24)
    {'experience_id': 22, 'tag_id': 13}, # Celebrity
    {'experience_id': 22, 'tag_id': 1},  # Exclusive Access
    {'experience_id': 23, 'tag_id': 10}, # Extreme
    {'experience_id': 23, 'tag_id': 3},  # Adventure
    {'experience_id': 23, 'tag_id': 4},  # Luxury
    {'experience_id': 24, 'tag_id': 13}, # Celebrity
    {'experience_id': 24, 'tag_id': 4},  # Luxury
    {'experience_id': 24, 'tag_id': 2},  # Once in a Lifetime
    
    # Archaeology experiences (25-27)
    {'experience_id': 25, 'tag_id': 12}, # Historical
    {'experience_id': 25, 'tag_id': 2},  # Once in a Lifetime
    {'experience_id': 25, 'tag_id': 5},  # Educational
    {'experience_id': 26, 'tag_id': 12}, # Historical
    {'experience_id': 26, 'tag_id': 6},  # Cultural
    {'experience_id': 26, 'tag_id': 1},  # Exclusive Access
    {'experience_id': 27, 'tag_id': 3},  # Adventure
    {'experience_id': 27, 'tag_id': 5},  # Educational
    {'experience_id': 27, 'tag_id': 14}, # Scientific
    
    # Luxury transport (28-30)
    {'experience_id': 28, 'tag_id': 4},  # Luxury
    {'experience_id': 28, 'tag_id': 12}, # Historical
    {'experience_id': 28, 'tag_id': 6},  # Cultural
    {'experience_id': 29, 'tag_id': 1},  # Exclusive Access
    {'experience_id': 29, 'tag_id': 3},  # Adventure
    {'experience_id': 29, 'tag_id': 5},  # Educational
    {'experience_id': 30, 'tag_id': 8},  # Space
    {'experience_id': 30, 'tag_id': 12}, # Historical
    {'experience_id': 30, 'tag_id': 5},  # Educational
    
    # Art experiences (31-33)
    {'experience_id': 31, 'tag_id': 13}, # Celebrity
    {'experience_id': 31, 'tag_id': 2},  # Once in a Lifetime
    {'experience_id': 31, 'tag_id': 1},  # Exclusive Access 
    {'experience_id': 32, 'tag_id': 6},  # Cultural
    {'experience_id': 32, 'tag_id': 12}, # Historical
    {'experience_id': 32, 'tag_id': 5},  # Educational
    {'experience_id': 33, 'tag_id': 6},  # Cultural
    {'experience_id': 33, 'tag_id': 1},  # Exclusive Access
    {'experience_id': 33, 'tag_id': 12}, # Historical
    
    # Scientific experiences (34-36)
    {'experience_id': 34, 'tag_id': 14}, # Scientific
    {'experience_id': 34, 'tag_id': 5},  # Educational
    {'experience_id': 34, 'tag_id': 1},  # Exclusive Access
    {'experience_id': 35, 'tag_id': 14}, # Scientific
    {'experience_id': 35, 'tag_id': 8},  # Space
    {'experience_id': 35, 'tag_id': 1},  # Exclusive Access
    {'experience_id': 36, 'tag_id': 14}, # Scientific
    {'experience_id': 36, 'tag_id': 9},  # Ocean
    {'experience_id': 36, 'tag_id': 10}, # Extreme
    
    # Royal experiences (37-39)
    {'experience_id': 37, 'tag_id': 4},  # Luxury
    {'experience_id': 37, 'tag_id': 12}, # Historical
    {'experience_id': 37, 'tag_id': 6},  # Cultural
    {'experience_id': 38, 'tag_id': 4},  # Luxury
    {'experience_id': 38, 'tag_id': 12}, # Historical
    {'experience_id': 38, 'tag_id': 1},  # Exclusive Access
    {'experience_id': 39, 'tag_id': 4},  # Luxury
    {'experience_id': 39, 'tag_id': 13}, # Celebrity
    {'experience_id': 39, 'tag_id': 1},  # Exclusive Access
    
    # Extreme luxury (40-42)
    {'experience_id': 40, 'tag_id': 4},  # Luxury
    {'experience_id': 40, 'tag_id': 2},  # Once in a Lifetime
    {'experience_id': 40, 'tag_id': 1},  # Exclusive Access
    {'experience_id': 41, 'tag_id': 4},  # Luxury
    {'experience_id': 41, 'tag_id': 8},  # Space
    {'experience_id': 41, 'tag_id': 10}, # Extreme
    {'experience_id': 42, 'tag_id': 3},  # Adventure
    {'experience_id': 42, 'tag_id': 1},  # Exclusive Access
    {'experience_id': 42, 'tag_id': 5},  # Educational
    
    # Spiritual experiences (43-45)
    {'experience_id': 43, 'tag_id': 15}, # Spiritual
    {'experience_id': 43, 'tag_id': 6},  # Cultural
    {'experience_id': 43, 'tag_id': 5},  # Educational
    {'experience_id': 44, 'tag_id': 15}, # Spiritual
    {'experience_id': 44, 'tag_id': 6},  # Cultural
    {'experience_id': 44, 'tag_id': 10}, # Extreme
    {'experience_id': 45, 'tag_id': 15}, # Spiritual
    {'experience_id': 45, 'tag_id': 4},  # Luxury
    {'experience_id': 45, 'tag_id': 5},  # Educational
    
    # Film & TV experiences (46-48)
    {'experience_id': 46, 'tag_id': 4},  # Luxury
    {'experience_id': 46, 'tag_id': 1},  # Exclusive Access
    {'experience_id': 46, 'tag_id': 6},  # Cultural
    {'experience_id': 47, 'tag_id': 3},  # Adventure
    {'experience_id': 47, 'tag_id': 13}, # Celebrity
    {'experience_id': 47, 'tag_id': 4},  # Luxury
    {'experience_id': 48, 'tag_id': 13}, # Celebrity
    {'experience_id': 48, 'tag_id': 1},  # Exclusive Access
    {'experience_id': 48, 'tag_id': 2},  # Once in a Lifetime
    
    # Rare access experiences (49-50)
    {'experience_id': 49, 'tag_id': 1},  # Exclusive Access
    {'experience_id': 49, 'tag_id': 3},  # Adventure
    {'experience_id': 49, 'tag_id': 5},  # Educational
    {'experience_id': 50, 'tag_id': 1},  # Exclusive Access
    {'experience_id': 50, 'tag_id': 12}, # Historical
    {'experience_id': 50, 'tag_id': 5},  # Educational
    
    # Featured Deals for Landing Page - Categories
    {'experience_id': 2, 'tag_id': 16},   # Black Origin Space Experience
    {'experience_id': 4, 'tag_id': 16},   # Submarine Expedition to Titanic
    {'experience_id': 31, 'tag_id': 16},  # Banksy Studio Visit
    
    # Once in a Lifetime
    {'experience_id': 4, 'tag_id': 16},   # Submarine Expedition to Titanic
    {'experience_id': 16, 'tag_id': 16},  # Gorilla Family Adoption
    {'experience_id': 25, 'tag_id': 16},  # Egyptian Tomb Opening
    
    # Adventure
    {'experience_id': 5, 'tag_id': 16},   # Great White Shark Cage Expedition
    {'experience_id': 11, 'tag_id': 16},  # Volcano Lava Lake Descent
    {'experience_id': 23, 'tag_id': 16},  # Formula 1 Driver Experience
    
    # Ocean
    {'experience_id': 4, 'tag_id': 16},   # Submarine Expedition to Titanic
    {'experience_id': 5, 'tag_id': 16},   # Great White Shark Cage Expedition
    {'experience_id': 21, 'tag_id': 16},  # Underwater Wine Cellar
    
    # Space
    {'experience_id': 1, 'tag_id': 16},   # Zero Gravity Space Training
    {'experience_id': 2, 'tag_id': 16},   # Black Origin Space Experience
    {'experience_id': 3, 'tag_id': 16},   # Private SpaceX Launch Viewing
    
    # Celebrity
    {'experience_id': 22, 'tag_id': 16},  # Hollywood Movie Set Access
    {'experience_id': 24, 'tag_id': 16},  # Private Concert Series
    {'experience_id': 47, 'tag_id': 16},  # James Bond Experience
    
    #Others
    {'experience_id': 51, 'tag_id': 6},  # Cultural
    {'experience_id': 51, 'tag_id': 12},  # Historical
    {'experience_id': 52, 'tag_id': 18},  # Entertainment 
    {'experience_id': 52, 'tag_id': 4},  # Luxury 
    {'experience_id': 53, 'tag_id': 18}, # Entertainment
    {'experience_id': 53, 'tag_id': 13}, # Celebrity
    {'experience_id': 54, 'tag_id': 13}, # Celebrity
    {'experience_id': 54, 'tag_id': 18}, # Entertainment
]
