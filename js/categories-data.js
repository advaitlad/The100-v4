const countriesByArea = [
    { name: "Russia", value: 17098246 },
    { name: "Canada", value: 9984670 },
    { name: "China", value: 9706961 },
    { name: "United States", value: 9372610 },
    { name: "Brazil", value: 8515770 },
    { name: "Australia", value: 7741220 },
    { name: "India", value: 3287263 },
    { name: "Argentina", value: 2780400 },
    { name: "Kazakhstan", value: 2724900 },
    { name: "Algeria", value: 2381741 },
    { name: "Democratic Republic of the Congo", value: 2344858 },
    { name: "Saudi Arabia", value: 2149690 },
    { name: "Mexico", value: 1964375 },
    { name: "Indonesia", value: 1904569 },
    { name: "Sudan", value: 1861484 },
    { name: "Libya", value: 1759540 },
    { name: "Iran", value: 1648195 },
    { name: "Mongolia", value: 1564110 },
    { name: "Peru", value: 1285216 },
    { name: "Chad", value: 1284000 },
    { name: "Niger", value: 1267000 },
    { name: "Angola", value: 1246700 },
    { name: "Mali", value: 1240192 },
    { name: "South Africa", value: 1219090 },
    { name: "Colombia", value: 1141748 },
    { name: "Ethiopia", value: 1104300 },
    { name: "Bolivia", value: 1098581 },
    { name: "Mauritania", value: 1030700 },
    { name: "Egypt", value: 1001450 },
    { name: "Tanzania", value: 945087 },
    { name: "Nigeria", value: 923768 },
    { name: "Venezuela", value: 916445 },
    { name: "Pakistan", value: 881913 },
    { name: "Namibia", value: 824292 },
    { name: "Mozambique", value: 799380 },
    { name: "Turkey", value: 783562 },
    { name: "Chile", value: 756102 },
    { name: "Zambia", value: 752618 },
    { name: "Myanmar", value: 676578 },
    { name: "Afghanistan", value: 652230 },
    { name: "Somalia", value: 637657 },
    { name: "Central African Republic", value: 622984 },
    { name: "Ukraine", value: 603550 },
    { name: "Madagascar", value: 587041 },
    { name: "Botswana", value: 581730 },
    { name: "Kenya", value: 580367 },
    { name: "France", value: 551695 },
    { name: "Yemen", value: 527968 },
    { name: "Thailand", value: 513120 },
    { name: "Spain", value: 505990 },
    { name: "Turkmenistan", value: 488100 },
    { name: "Cameroon", value: 475442 },
    { name: "Papua New Guinea", value: 462840 },
    { name: "Sweden", value: 450295 },
    { name: "Uzbekistan", value: 447400 },
    { name: "Morocco", value: 446550 },
    { name: "Iraq", value: 438317 },
    { name: "Paraguay", value: 406752 },
    { name: "Zimbabwe", value: 390757 },
    { name: "Japan", value: 377975 },
    { name: "Germany", value: 357114 },
    { name: "Republic of the Congo", value: 342000 },
    { name: "Finland", value: 338424 },
    { name: "Vietnam", value: 331212 },
    { name: "Malaysia", value: 330803 },
    { name: "Norway", value: 323802 },
    { name: "Ivory Coast", value: 322463 },
    { name: "Poland", value: 312696 },
    { name: "Oman", value: 309500 },
    { name: "Italy", value: 301336 },
    { name: "Philippines", value: 300000 },
    { name: "Ecuador", value: 283561 },
    { name: "Burkina Faso", value: 274200 },
    { name: "New Zealand", value: 270467 },
    { name: "Gabon", value: 267668 },
    { name: "Western Sahara", value: 266000 },
    { name: "Guinea", value: 245857 },
    { name: "United Kingdom", value: 242495 },
    { name: "Uganda", value: 241550 },
    { name: "Ghana", value: 238535 },
    { name: "Romania", value: 238391 },
    { name: "Laos", value: 236800 },
    { name: "Belarus", value: 207600 },
    { name: "Kyrgyzstan", value: 199951 },
    { name: "Senegal", value: 196722 },
    { name: "Syria", value: 185180 },
    { name: "Cambodia", value: 181035 },
    { name: "Uruguay", value: 176215 },
    { name: "Tunisia", value: 163610 },
    { name: "Suriname", value: 163820 },
    { name: "Bangladesh", value: 147570 },
    { name: "Nepal", value: 147181 },
    { name: "Tajikistan", value: 143100 },
    { name: "Greece", value: 131957 },
    { name: "Nicaragua", value: 130373 },
    { name: "North Korea", value: 120538 },
    { name: "Malawi", value: 118484 },
    { name: "Eritrea", value: 117600 },
    { name: "Benin", value: 112622 },
    { name: "Honduras", value: 112090 },
    { name: "Liberia", value: 111369 },
    { name: "Bulgaria", value: 110879 },
    { name: "Cuba", value: 109884 },
    { name: "Guatemala", value: 108889 },
    { name: "Iceland", value: 103000 }
];

const countriesByPopulation = [
    { name: "India", value: 1463870000 },
    { name: "China", value: 1416100000 },
    { name: "United States", value: 347276000 },
    { name: "Indonesia", value: 285721000 },
    { name: "Pakistan", value: 255220000 },
    { name: "Nigeria", value: 237528000 },
    { name: "Brazil", value: 212812000 },
    { name: "Bangladesh", value: 175687000 },
    { name: "Russia", value: 143997000 },
    { name: "Ethiopia", value: 135472000 },
    { name: "Mexico", value: 128933000 },
    { name: "Japan", value: 125836000 },
    { name: "Philippines", value: 120000000 },
    { name: "Egypt", value: 110000000 },
    { name: "Vietnam", value: 100000000 },
    { name: "Democratic Republic of the Congo", value: 95000000 },
    { name: "Turkey", value: 90000000 },
    { name: "Iran", value: 85000000 },
    { name: "Germany", value: 84000000 },
    { name: "Thailand", value: 70000000 },
    { name: "United Kingdom", value: 68000000 },
    { name: "France", value: 65000000 },
    { name: "Italy", value: 60000000 },
    { name: "Tanzania", value: 59000000 },
    { name: "South Africa", value: 58000000 },
    { name: "Myanmar", value: 55000000 },
    { name: "Kenya", value: 54000000 },
    { name: "South Korea", value: 52000000 },
    { name: "Colombia", value: 51000000 },
    { name: "Spain", value: 47000000 },
    { name: "Uganda", value: 46000000 },
    { name: "Argentina", value: 45000000 },
    { name: "Algeria", value: 44000000 },
    { name: "Sudan", value: 43000000 },
    { name: "Ukraine", value: 41000000 },
    { name: "Iraq", value: 40000000 },
    { name: "Afghanistan", value: 39000000 },
    { name: "Poland", value: 38000000 },
    { name: "Canada", value: 37742000 },
    { name: "Morocco", value: 36910000 },
    { name: "Saudi Arabia", value: 34813000 },
    { name: "Uzbekistan", value: 33469000 },
    { name: "Peru", value: 32971000 },
    { name: "Angola", value: 32866000 },
    { name: "Malaysia", value: 32366000 },
    { name: "Mozambique", value: 31255000 },
    { name: "Ghana", value: 31073000 },
    { name: "Yemen", value: 29826000 },
    { name: "Nepal", value: 29137000 },
    { name: "Venezuela", value: 28436000 },
    { name: "Madagascar", value: 27691000 },
    { name: "Cameroon", value: 26546000 },
    { name: "Ivory Coast", value: 26378000 },
    { name: "North Korea", value: 25778000 },
    { name: "Australia", value: 25499000 },
    { name: "Niger", value: 24206000 },
    { name: "Taiwan", value: 23817000 },
    { name: "Sri Lanka", value: 21413000 },
    { name: "Burkina Faso", value: 20903000 },
    { name: "Mali", value: 20251000 },
    { name: "Romania", value: 19238000 },
    { name: "Malawi", value: 19130000 },
    { name: "Chile", value: 19116000 },
    { name: "Kazakhstan", value: 18777000 },
    { name: "Zambia", value: 18384000 },
    { name: "Guatemala", value: 17916000 },
    { name: "Ecuador", value: 17643000 },
    { name: "Syria", value: 17501000 },
    { name: "Netherlands", value: 17134000 },
    { name: "Senegal", value: 16744000 },
    { name: "Cambodia", value: 16719000 },
    { name: "Chad", value: 16426000 },
    { name: "Somalia", value: 15893000 },
    { name: "Zimbabwe", value: 14863000 },
    { name: "Guinea", value: 13133000 },
    { name: "Rwanda", value: 12952000 },
    { name: "Benin", value: 12123000 },
    { name: "Burundi", value: 11891000 },
    { name: "Tunisia", value: 11818000 },
    { name: "Bolivia", value: 11673000 },
    { name: "Belgium", value: 11590000 },
    { name: "Haiti", value: 11402000 },
    { name: "Cuba", value: 11327000 },
    { name: "South Sudan", value: 11193000 },
    { name: "Dominican Republic", value: 10848000 },
    { name: "Czechia", value: 10709000 },
    { name: "Greece", value: 10423000 },
    { name: "Jordan", value: 10203000 },
    { name: "Portugal", value: 10196000 }
];


const instagramFollowers = [
    { "name": "Cristiano Ronaldo", value: 651.11 },
    { "name": "Lionel Messi", value: 504.97 },
    { "name": "Selena Gomez", value: 421.11 },
    { "name": "Dwayne Johnson", value: 394.71 },
    { "name": "Kylie Jenner", value: 394.30 },
    { "name": "Ariana Grande", value: 380.43 },
    { "name": "Kim Kardashian", value: 358.00 },
    { "name": "Beyoncé", value: 313.00 },
    { "name": "Khloé Kardashian", value: 305.00 },
    { "name": "Justin Bieber", value: 295.05 },
    { "name": "Kendall Jenner", value: 290.00 },
    { "name": "Taylor Swift", value: 283.00 },
    { "name": "Virat Kohli", value: 270.00 },
    { "name": "Jennifer Lopez", value: 249.00 },
    { "name": "Nicki Minaj", value: 227.00 },
    { "name": "Neymar Jr", value: 227.00 },
    { "name": "Kourtney Kardashian", value: 220.00 },
    { "name": "Miley Cyrus", value: 213.00 },
    { "name": "Katy Perry", value: 205.00 },
    { "name": "Zendaya", value: 180.00 },
    { "name": "Kevin Hart", value: 177.00 },
    { "name": "Cardi B", value: 164.00 },
    { "name": "LeBron James", value: 159.00 },
    { "name": "Demi Lovato", value: 154.00 },
    { "name": "Rihanna", value: 150.00 },
    { "name": "Chris Brown", value: 144.00 },
    { "name": "Drake", value: 143.00 },
    { "name": "Ellen DeGeneres", value: 137.00 },
    { "name": "Kylian Mbappé", value: 122.00 },
    { "name": "Billie Eilish", value: 121.00 },
    { "name": "Gal Gadot", value: 108.00 },
    { "name": "Lalisa Manoban", value: 105.00 },
    { "name": "Vin Diesel", value: 103.00 },
    { "name": "Shraddha Kapoor", value: 94.20 },
    { "name": "Priyanka Chopra", value: 92.50 },
    { "name": "Narendra Modi", value: 92.40 },
    { "name": "Shakira", value: 91.50 },
    { "name": "Snoop Dogg", value: 88.20 },
    { "name": "David Beckham", value: 88.00 },
    { "name": "Dua Lipa", value: 87.30 },
    { "name": "Kim Jennie", value: 86.70 },
    { "name": "Alia Bhatt", value: 86.20 },
    { "name": "Anushka Sharma", value: 84.00 },
    { "name": "Deepika Padukone", value: 83.00 },
    { "name": "Kareena Kapoor", value: 82.00 },
    { "name": "Jacqueline Fernandez", value: 81.00 },
    { "name": "Akshay Kumar", value: 80.00 },
    { "name": "Ranveer Singh", value: 79.00 },
    { "name": "Hrithik Roshan", value: 78.00 },
    { "name": "Chris Hemsworth", value: 77.00 },
    { "name": "Emma Watson", value: 76.00 },
    { "name": "Tom Holland", value: 75.00 },
    { "name": "Robert Downey Jr.", value: 74.00 },
    { "name": "Zayn Malik", value: 72.00 },
    { "name": "Camila Cabello", value: 71.00 },
    { "name": "Shawn Mendes", value: 70.00 },
    { "name": "Ed Sheeran", value: 69.00 },
    { "name": "Bruno Mars", value: 68.00 },
    { "name": "Lady Gaga", value: 67.00 },
    { "name": "Adele", value: 66.00 },
    { "name": "Harry Styles", value: 65.00 },
    { "name": "Niall Horan", value: 64.00 },
    { "name": "Louis Tomlinson", value: 63.00 },
    { "name": "Liam Payne", value: 62.00 },
    { "name": "Megan Thee Stallion", value: 61.00 },
    { "name": "Doja Cat", value: 60.00 },
    { "name": "Olivia Rodrigo", value: 59.00 },
    { "name": "Ava Max", value: 58.00 },
    { "name": "Khabane Lame", value: 57.00 },
    { "name": "Huda Kattan", value: 55.00 },
    { "name": "Lele Pons", value: 54.00 },
    { "name": "Charli D'Amelio", value: 53.00 },
    { "name": "Addison Rae", value: 51.00 },
    { "name": "Luisito Comunica", value: 50.00 },
    { "name": "Zach King", value: 49.00 },
    { "name": "Chiara Ferragni", value: 48.00 },
    { "name": "Logan Paul", value: 47.00 },
    { "name": "Hannah Stocking", value: 46.00 },
    { "name": "Brent Rivera", value: 45.00 },
    { "name": "Gordon Ramsay", value: 44.00 },
    { "name": "James Charles", value: 43.00 },
    { "name": "PewDiePie", value: 42.00 },
    { "name": "MrBeast", value: 41.00 },
    { "name": "Bretman Rock", value: 40.00 },
    { "name": "Liza Koshy", value: 39.00 },
    { "name": "David Dobrik", value: 38.00 },
    { "name": "King Bach", value: 37.00 },
    { "name": "Sommer Ray", value: 36.00 }
];

const spotifyTop100 = [
    { name: "Blinding Lights", value: 4.764 },
    { name: "Shape of You", value: 4.281 },
    { name: "Someone You Loved", value: 3.843 },
    { name: "Starboy", value: 3.808 },
    { name: "As It Was", value: 3.807 },
    { name: "Sunflower", value: 3.752 },
    { name: "Sweater Weather", value: 3.659 },
    { name: "One Dance", value: 3.572 },
    { name: "Stay", value: 3.503 },
    { name: "Believer", value: 3.369 },
    { name: "Perfect", value: 3.356 },
    { name: "Heat Waves", value: 3.327 },
    { name: "Lovely", value: 3.245 },
    { name: "Dance Monkey", value: 3.233 },
    { name: "Say You Won't Let Go", value: 3.199 },
    { name: "Closer", value: 3.198 },
    { name: "Watermelon Sugar", value: 2.852 },
    { name: "Señorita", value: 2.840 },
    { name: "Something Just Like This", value: 2.816 },
    { name: "Riptide", value: 2.744 },
    { name: "Don't Start Now", value: 2.741 },
    { name: "Take Me to Church", value: 2.725 },
    { name: "Another Love", value: 2.678 },
    { name: "Photograph", value: 2.650 },
    { name: "Counting Stars", value: 2.648 },
    { name: "Lucid Dreams", value: 2.646 },
    { name: "God's Plan", value: 2.615 },
    { name: "Circles", value: 2.612 },
    { name: "Bohemian Rhapsody", value: 2.603 },
    { name: "bad guy", value: 2.594 },
    { name: "Thinking Out Loud", value: 2.587 },
    { name: "Can't Hold Us", value: 2.574 },
    { name: "Shallow", value: 2.564 },
    { name: "goosebumps", value: 2.561 },
    { name: "Yellow", value: 2.560 },
    { name: "Love Yourself", value: 2.547 },
    { name: "Cruel Summer", value: 2.530 },
    { name: "Thunder", value: 2.519 },
    { name: "I Wanna Be Yours", value: 2.513 },
    { name: "All of Me", value: 2.495 },
    { name: "Lean On", value: 2.494 },
    { name: "Happier", value: 2.493 },
    { name: "Stressed Out", value: 2.492 },
    { name: "Faded", value: 2.491 },
    { name: "Let Me Love You", value: 2.490 },
    { name: "7 rings", value: 2.489 },
    { name: "Sorry", value: 2.488 },
    { name: "XO Tour Llif3", value: 2.487 },
    { name: "Don't Let Me Down", value: 2.486 },
    { name: "HUMBLE.", value: 2.485 },
    { name: "Viva La Vida", value: 2.484 },
    { name: "Wake Me Up", value: 2.483 },
    { name: "Without Me", value: 2.482 },
    { name: "Mr. Brightside", value: 2.481 },
    { name: "Every Breath You Take", value: 2.480 },
    { name: "No Role Modelz", value: 2.479 },
    { name: "Do I Wanna Know?", value: 2.478 },
    { name: "Lose Yourself", value: 2.477 },
    { name: "Let Her Go", value: 2.476 },
    { name: "The Less I Know The Better", value: 2.475 },
    { name: "SAD!", value: 2.474 },
    { name: "Sicko Mode", value: 2.473 },
    { name: "drivers license", value: 2.472 },
    { name: "The Hills", value: 2.470 },
    { name: "Paradise", value: 2.469 },
    { name: "Young Dumb & Broke", value: 2.468 },
    { name: "Unstoppable", value: 2.467 },
    { name: "Dynamite", value: 2.466 },
    { name: "Peaches", value: 2.465 },
    { name: "MONTERO (Call Me By Your Name)", value: 2.464 },
    { name: "Old Town Road", value: 2.463 },
    { name: "High Hopes", value: 2.462 },
    { name: "Shivers", value: 2.461 },
    { name: "Levitating", value: 2.460 },
    { name: "abcdefu", value: 2.459 },
    { name: "INDUSTRY BABY", value: 2.458 },
    { name: "Happier Than Ever", value: 2.456 },
    { name: "Save Your Tears", value: 2.455 },
    { name: "Good 4 U", value: 2.454 },
    { name: "Butter", value: 2.453 },
    { name: "Easy On Me", value: 2.452 },
    { name: "Bad Habits", value: 2.450 },
    { name: "Beggin'", value: 2.449 },
    { name: "Cold Heart", value: 2.448 },
    { name: "Enemy", value: 2.447 },
    { name: "Woman", value: 2.446 },
    { name: "Ghost", value: 2.445 },
    { name: "Smells Like Teen Spirit", value: 2.444 },
    { name: "We Don't Talk Anymore", value: 2.440 },
    { name: "The Box", value: 2.439 },
    { name: "Attention", value: 2.438 },
    { name: "No Tears Left to Cry", value: 2.437 },
    { name: "Rockstar", value: 2.436 },
    { name: "Meant to Be", value: 2.435 },
    { name: "Bones", value: 2.434 },
    { name: "Truth Hurts", value: 2.433 },
    { name: "Don't Stop Believin'", value: 2.432 },
    { name: "Poker Face", value: 2.430 },
    { name: "You Right", value: 2.429 },
    { name: "Say So", value: 2.427 },
    { name: "Super Gremlin", value: 2.426 },
    { name: "Stay With Me", value: 2.423 },
    { name: "Love Nwantiti", value: 2.422 }
];

const netflixTop100 = [
    { name: "Red Notice", value: 364.02 },
    { name: "Don't Look Up", value: 359.79 },
    { name: "Bird Box", value: 282.02 },
    { name: "Glass Onion: A Knives Out Mystery", value: 279.74 },
    { name: "The Gray Man", value: 253.87 },
    { name: "The Mother", value: 234.07 },
    { name: "The Adam Project", value: 233.16 },
    { name: "Extraction", value: 231.34 },
    { name: "Purple Hearts", value: 228.69 },
    { name: "The Unforgivable", value: 214.70 },
    { name: "The Irishman", value: 214.57 },
    { name: "The Kissing Booth 2", value: 209.25 },
    { name: "6 Underground", value: 205.47 },
    { name: "Spenser Confidential", value: 197.32 },
    { name: "Enola Holmes", value: 189.90 },
    { name: "Army of the Dead", value: 186.54 },
    { name: "The Old Guard", value: 185.71 },
    { name: "Murder Mystery", value: 169.59 },
    { name: "Troll", value: 155.56 },
    { name: "Blood Red Sky", value: 110.52 },
    { name: "The Platform", value: 108.09 },
    { name: "All Quiet on the Western Front", value: 101.36 },
    { name: "The Midnight Sky", value: 100.00 },
    { name: "Project Power", value: 99.00 },
    { name: "We Can Be Heroes", value: 98.00 },
    { name: "Fatherhood", value: 97.00 },
    { name: "The Guilty", value: 96.00 },
    { name: "Sweet Girl", value: 95.00 },
    { name: "Outside the Wire", value: 94.00 },
    { name: "The Christmas Chronicles: Part Two", value: 93.00 },
    { name: "The Wrong Missy", value: 92.00 },
    { name: "The Kissing Booth 3", value: 91.00 },
    { name: "I Care a Lot", value: 90.00 },
    { name: "He's All That", value: 89.00 },
    { name: "The Mitchells vs. The Machines", value: 88.00 },
    { name: "Army of Thieves", value: 87.00 },
    { name: "Yes Day", value: 86.00 },
    { name: "The Christmas Chronicles", value: 85.00 },
    { name: "The Old Guard 2", value: 84.00 },
    { name: "The Harder They Fall", value: 83.00 },
    { name: "The Woman in the Window", value: 82.00 },
    { name: "Kate", value: 81.00 },
    { name: "The Dig", value: 80.00 },
    { name: "The Devil All the Time", value: 79.00 },
    { name: "The Two Popes", value: 78.00 },
    { name: "The Laundromat", value: 77.00 },
    { name: "The King", value: 76.00 },
    { name: "The Highwaymen", value: 75.00 },
    { name: "The Perfect Date", value: 74.00 },
    { name: "The Willoughbys", value: 73.00 },
    { name: "The Half of It", value: 72.00 },
    { name: "The Lovebirds", value: 71.00 },
    { name: "The Last Days of American Crime", value: 70.00 },
    { name: "The Wrong Missy 2", value: 69.00 },
    { name: "The Princess Switch 3", value: 68.00 },
    { name: "The Knight Before Christmas", value: 67.00 },
    { name: "The Midnight Sky", value: 66.00 },
    { name: "The Out-Laws", value: 65.00 },
    { name: "The Perfect Date", value: 64.00 },
    { name: "The Sea Beast", value: 63.00 },
    { name: "The Trial of the Chicago 7", value: 62.00 },
    { name: "Thunder Force", value: 61.00 },
    { name: "To All the Boys: Always and Forever", value: 60.00 },
    { name: "Triple Frontier", value: 59.00 },
    { name: "Tyler Perry's A Fall From Grace", value: 58.00 },
    { name: "We Can Be Heroes", value: 57.00 },
    { name: "Wish Dragon", value: 56.00 },
    { name: "Yes Day", value: 55.00 },
    { name: "Your Place or Mine", value: 54.00 },
    { name: "You People", value: 53.00 },
    { name: "You Are So Not Invited to My Bat Mitzvah", value: 52.00 },
    { name: "The Adam Project", value: 51.00 },
    { name: "Extraction 2", value: 50.00 },
    { name: "The Wonder", value: 49.00 },
    { name: "The Good Nurse", value: 48.00 },
    { name: "The Swimmers", value: 47.00 },
    { name: "White Noise", value: 46.00 },
    { name: "Slumberland", value: 45.00 },
    { name: "Lady Chatterley's Lover", value: 44.00 },
    { name: "Blonde", value: 43.00 },
    { name: "Lou", value: 42.00 },
    { name: "Do Revenge", value: 41.00 },
    { name: "Day Shift", value: 40.00 },
    { name: "Purple Hearts", value: 39.00 },
    { name: "Carter", value: 38.00 },
    { name: "The Sea Beast", value: 37.00 },
    { name: "Persuasion", value: 36.00 },
    { name: "Hello, Goodbye, and Everything in Between", value: 35.00 },
    { name: "Hustle", value: 34.00 },
    { name: "Interceptor", value: 33.00 },
    { name: "Along for the Ride", value: 32.00 },
    { name: "Choose or Die", value: 31.00 },
    { name: "Metal Lords", value: 30.00 },
    { name: "Apollo 10½", value: 29.00 },
    { name: "Windfall", value: 28.00 },
    { name: "The Adam Project", value: 27.00 },
    { name: "The Weekend Away", value: 26.00 },
    { name: "Against the Ice", value: 25.00 },
    { name: "Texas Chainsaw Massacre", value: 24.00 },
    { name: "The Royal Treatment", value: 23.00 },
    { name: "Home Team", value: 22.00 }
];

// Create the gameData object that the game uses
window.gameData = {
    area: {
        title: "Top 100 Countries by Area",
        unit: "km²",
        data: countriesByArea,
        icon: 'fas fa-globe-americas'
    },
    population: {
        title: "Top 100 Countries by Population",
        unit: "people",
        data: countriesByPopulation,
        icon: 'fas fa-users'
    },
    instagram: {
        title: "Top 100 Most Followed on Instagram",
        unit: "million followers",
        data: instagramFollowers,
        icon: 'fab fa-instagram'
    },
    spotify: {
        title: "Top 100 Most Played Songs on Spotify",
        unit: "billion plays",
        data: spotifyTop100,
        icon: 'fab fa-spotify'
    },
    netflix: {
        title: "Top 100 Most Watched Movies on Netflix",
        data: netflixTop100,
        unit: 'M hours',
        icon: 'fas fa-play-circle',
    }
};

// Export the categories for use in script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.gameData;
} 