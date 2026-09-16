import { MajlisUserRecord, AuthUser } from '../types';
export type { MajlisUserRecord, AuthUser };

export const INITIAL_MAJLIS_USERS: MajlisUserRecord[] = [
  {
    "sl": 1,
    "english": "Ahmadnagar",
    "bangla": "আহমদনগর",
    "mobile": "8801740550584",
    "district": "পঞ্চগড়",
    "region": "দিনাজপুর-পঞ্চগড়",
    "fullName": "আহমদনগর (Ahmadnagar)"
  },
  {
    "sl": 2,
    "english": "Akhaura",
    "bangla": "আখাউড়া",
    "mobile": "8801714530007",
    "district": "ব্রাহ্মণবাড়িয়া-১",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "আখাউড়া (Akhaura)"
  },
  {
    "sl": 3,
    "english": "Ambornagar",
    "bangla": "অম্বরনগর",
    "mobile": "8801782745261",
    "district": "কুমিল্লা ও চাঁদপুর",
    "region": "চট্টগ্রাম-কক্সবাজার",
    "fullName": "অম্বরনগর (Ambornagar)"
  },
  {
    "sl": 4,
    "english": "Ashkona",
    "bangla": "আশকোনা",
    "mobile": "8801762423952",
    "district": "ঢাকা মেট্রো",
    "region": "ঢাকা",
    "fullName": "আশকোনা (Ashkona)"
  },
  {
    "sl": 5,
    "english": "Ashulia",
    "bangla": "আশুলিয়া",
    "mobile": "8801762029117",
    "district": "গাজীপুর",
    "region": "ঢাকা",
    "fullName": "আশুলিয়া (Ashulia)"
  },
  {
    "sl": 6,
    "english": "B. Char",
    "bangla": "বড়চর",
    "mobile": "8801722137207",
    "district": "হবিগঞ্জ-মৌলবীবাজার",
    "region": "সিলেট-সুনামগঞ্জ",
    "fullName": "বড়চর (B. Char)"
  },
  {
    "sl": 7,
    "english": "Bahadurpur",
    "bangla": "বাহাদুরপুর",
    "mobile": "8801786586098",
    "district": "কুষ্টিয়া",
    "region": "কুষ্টিয়া-চূয়াডাঙ্গা",
    "fullName": "বাহাদুরপুর (Bahadurpur)"
  },
  {
    "sl": 8,
    "english": "Bakshigonj",
    "bangla": "বকশীগঞ্জ",
    "mobile": "8801301892111",
    "district": "জামালপুর-২",
    "region": "ময়মনসিংহ-নেত্রকোনা",
    "fullName": "বকশীগঞ্জ (Bakshigonj)"
  },
  {
    "sl": 9,
    "english": "Baniajan",
    "bangla": "বানিয়াজান",
    "mobile": "8801608616464",
    "district": "জামালপুর-২",
    "region": "জামালপুর-টাঙ্গাইল-শেরপুর",
    "fullName": "বানিয়াজান (Baniajan)"
  },
  {
    "sl": 10,
    "english": "Barishal",
    "bangla": "বরিশাল",
    "mobile": "8801712102377",
    "district": "বড়গুনা",
    "region": "বরিশাল-পটুয়াখালী",
    "fullName": "বরিশাল (Barishal)"
  },
  {
    "sl": 11,
    "english": "Batiapara",
    "bangla": "বটিয়াপাড়া",
    "mobile": "8801731443589",
    "district": "চুয়াডাঙ্গা",
    "region": "কুষ্টিয়া-চূয়াডাঙ্গা",
    "fullName": "বটিয়াপাড়া (Batiapara)"
  },
  {
    "sl": 12,
    "english": "Beergaon",
    "bangla": "বীরগাঁও",
    "mobile": "8801732190592",
    "district": "সিলেট-সুনামগঞ্জ",
    "region": "সিলেট-সুনামগঞ্জ",
    "fullName": "বীরগাঁও (Beergaon)"
  },
  {
    "sl": 13,
    "english": "Betal",
    "bangla": "বেতাল",
    "mobile": "8801726333832",
    "district": "কিশোরগঞ্জ-২",
    "region": "কিশোরগঞ্জ",
    "fullName": "বেতাল (Betal)"
  },
  {
    "sl": 14,
    "english": "Bhairabbazar",
    "bangla": "ভৈরববাজার",
    "mobile": "8801776269661",
    "district": "কিশোরগঞ্জ-২",
    "region": "কিশোরগঞ্জ",
    "fullName": "ভৈরববাজার (Bhairabbazar)"
  },
  {
    "sl": 15,
    "english": "Bharatpur",
    "bangla": "ভরতপুর",
    "mobile": "8801767406035",
    "district": "নাটোর-১",
    "region": "বগুড়া-নাটোর",
    "fullName": "ভরতপুর (Bharatpur)"
  },
  {
    "sl": 16,
    "english": "Bhatgaon",
    "bangla": "ভাতগাঁও",
    "mobile": "8801718145949",
    "district": "দিনাজপুর-১",
    "region": "দিনাজপুর-পঞ্চগড়",
    "fullName": "ভাতগাঁও (Bhatgaon)"
  },
  {
    "sl": 17,
    "english": "Birgonj",
    "bangla": "বীরগঞ্জ",
    "mobile": "8801786986239",
    "district": "দিনাজপুর-২",
    "region": "দিনাজপুর-পঞ্চগড়",
    "fullName": "বীরগঞ্জ (Birgonj)"
  },
  {
    "sl": 18,
    "english": "Birpaiksha",
    "bangla": "বীরপাইকশা",
    "mobile": "8801928992624",
    "district": "কিশোরগঞ্জ-১",
    "region": "কিশোরগঞ্জ",
    "fullName": "বীরপাইকশা (Birpaiksha)"
  },
  {
    "sl": 19,
    "english": "Bishnupur",
    "bangla": "বিষ্ণুপুর",
    "mobile": "8801954453850",
    "district": "ব্রাহ্মণবাড়িয়া-১",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "বিষ্ণুপুর (Bishnupur)"
  },
  {
    "sl": 20,
    "english": "Bogura",
    "bangla": "বগুড়া",
    "mobile": "8801768796479",
    "district": "বগুড়া",
    "region": "বগুড়া-নাটোর",
    "fullName": "বগুড়া (Bogura)"
  },
  {
    "sl": 21,
    "english": "Borobaishdia",
    "bangla": "বড়বাইশদিয়া",
    "mobile": "8801761888180",
    "district": "বরিশাল-পটুয়াখালী",
    "region": "বরিশাল-পটুয়াখালী",
    "fullName": "বড়বাইশদিয়া (Borobaishdia)"
  },
  {
    "sl": 22,
    "english": "Borochor",
    "bangla": "বড়চর",
    "mobile": "8801722137207",
    "district": "হবিগঞ্জ-মৌলবীবাজার",
    "region": "সিলেট-সুনামগঞ্জ",
    "fullName": "বড়চর (Borochor)"
  },
  {
    "sl": 23,
    "english": "Brahmanbaria",
    "bangla": "ব্রাহ্মণবাড়িয়া",
    "mobile": "8801716516866",
    "district": "ব্রাহ্মণবাড়িয়া-১",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "ব্রাহ্মণবাড়িয়া (Brahmanbaria)"
  },
  {
    "sl": 24,
    "english": "Cha. Cha Bagan",
    "bangla": "চাঁন্দপুর চা-বাগান",
    "mobile": "8801718087483",
    "district": "হবিগঞ্জ-মৌলবীবাজার",
    "region": "সিলেট-সুনামগঞ্জ",
    "fullName": "চাঁন্দপুর চা-বাগান (Cha. Cha Bagan)"
  },
  {
    "sl": 25,
    "english": "Chantara",
    "bangla": "চাঁনতারা",
    "mobile": "88",
    "district": "Mymensingh-1",
    "region": "ময়মনসিংহ-নেত্রকোনা",
    "fullName": "চাঁনতারা (Chantara)"
  },
  {
    "sl": 26,
    "english": "Chardukhia",
    "bangla": "চরদুঃখিয়া",
    "mobile": "8801812427577",
    "district": "কুমিল্লা ও চাঁদপুর",
    "region": "চট্টগ্রাম-কক্সবাজার",
    "fullName": "চরদুঃখিয়া (Chardukhia)"
  },
  {
    "sl": 27,
    "english": "Charsindur",
    "bangla": "চরসিন্দুর",
    "mobile": "8801710190232",
    "district": "নারায়ণগঞ্জ ও নরসিংদি",
    "region": "ঢাকা",
    "fullName": "চরসিন্দুর (Charsindur)"
  },
  {
    "sl": 28,
    "english": "Chittagong",
    "bangla": "চট্টগ্রাম",
    "mobile": "8801734416398",
    "district": "চট্টগ্রাম ও পার্বত্য",
    "region": "চট্টগ্রাম-কক্সবাজার",
    "fullName": "চট্টগ্রাম (Chittagong)"
  },
  {
    "sl": 29,
    "english": "Chonotia",
    "bangla": "ছোনটিয়া",
    "mobile": "8801864769745",
    "district": "জামালপুর-১",
    "region": "জামালপুর-টাঙ্গাইল-শেরপুর",
    "fullName": "ছোনটিয়া (Chonotia)"
  },
  {
    "sl": 30,
    "english": "Choraikhola",
    "bangla": "চড়াইখোলা",
    "mobile": "8801725181839",
    "district": "নিলফামারী-রংপুর",
    "region": "রংপুর-গাইবান্ধা",
    "fullName": "চড়াইখোলা (Choraikhola)"
  },
  {
    "sl": 31,
    "english": "Chuadanga",
    "bangla": "চুয়াডাঙ্গা",
    "mobile": "8801917937108",
    "district": "চুয়াডাঙ্গা",
    "region": "কুষ্টিয়া-চূয়াডাঙ্গা",
    "fullName": "চুয়াডাঙ্গা (Chuadanga)"
  },
  {
    "sl": 32,
    "english": "Comilla",
    "bangla": "কুমিল্লা",
    "mobile": "8801910148977",
    "district": "কুমিল্লা ও চাঁদপুর",
    "region": "চট্টগ্রাম-কক্সবাজার",
    "fullName": "কুমিল্লা (Comilla)"
  },
  {
    "sl": 33,
    "english": "Dhaka",
    "bangla": "ঢাকা",
    "mobile": "8801730028576",
    "district": "Central",
    "region": "Central",
    "fullName": "ঢাকা (Dhaka)"
  },
  {
    "sl": 34,
    "english": "Dhanikhola",
    "bangla": "ধানীখোলা",
    "mobile": "8801761568154",
    "district": "Mymensingh-1",
    "region": "ময়মনসিংহ-নেত্রকোনা",
    "fullName": "ধানীখোলা (Dhanikhola)"
  },
  {
    "sl": 35,
    "english": "Dighapatia",
    "bangla": "দিঘাপতিয়া",
    "mobile": "8801704149150",
    "district": "নাটোর-১",
    "region": "বগুড়া-নাটোর",
    "fullName": "দিঘাপতিয়া (Dighapatia)"
  },
  {
    "sl": 36,
    "english": "Dinajpur",
    "bangla": "দিনাজপুর",
    "mobile": "8801995230280",
    "district": "দিনাজপুর-১",
    "region": "দিনাজপুর-পঞ্চগড়",
    "fullName": "দিনাজপুর (Dinajpur)"
  },
  {
    "sl": 37,
    "english": "Dohanda",
    "bangla": "ডোহান্ডা",
    "mobile": "8801729520949",
    "district": "দিনাজপুর-২",
    "region": "দিনাজপুর-পঞ্চগড়",
    "fullName": "ডোহান্ডা (Dohanda)"
  },
  {
    "sl": 38,
    "english": "Durgapur",
    "bangla": "দূর্গাপুর",
    "mobile": "8801711006895",
    "district": "রাজশাহী-২",
    "region": "রাজশাহী-পাবনা",
    "fullName": "দূর্গাপুর (Durgapur)"
  },
  {
    "sl": 39,
    "english": "Durgarampur",
    "bangla": "দূর্গারামপুর",
    "mobile": "8801310312426",
    "district": "ব্রাহ্মণবাড়িয়া-২",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "দূর্গারামপুর (Durgarampur)"
  },
  {
    "sl": 40,
    "english": "Fatulla",
    "bangla": "ফতুল্লা",
    "mobile": "8801911107558",
    "district": "নারায়ণগঞ্জ ও নরসিংদি",
    "region": "ঢাকা",
    "fullName": "ফতুল্লা (Fatulla)"
  },
  {
    "sl": 41,
    "english": "Fazilpur",
    "bangla": "ফাজিলপুর",
    "mobile": "8801814187942",
    "district": "কুমিল্লা ও চাঁদপুর",
    "region": "চট্টগ্রাম-কক্সবাজার",
    "fullName": "ফাজিলপুর (Fazilpur)"
  },
  {
    "sl": 42,
    "english": "Fulbaria",
    "bangla": "ফুলবাড়ীয়া",
    "mobile": "8801753363681",
    "district": "Mymensingh-1",
    "region": "ময়মনসিংহ-নেত্রকোনা",
    "fullName": "ফুলবাড়ীয়া (Fulbaria)"
  },
  {
    "sl": 43,
    "english": "Gaibandha",
    "bangla": "গাইবান্ধা",
    "mobile": "8801721903649",
    "district": "রংপুর-গাইবান্ধা",
    "region": "রংপুর-গাইবান্ধা",
    "fullName": "গাইবান্ধা (Gaibandha)"
  },
  {
    "sl": 44,
    "english": "Galimgazi",
    "bangla": "গালিমগাজী",
    "mobile": "8801553255158",
    "district": "কিশোরগঞ্জ-২",
    "region": "কিশোরগঞ্জ",
    "fullName": "গালিমগাজী (Galimgazi)"
  },
  {
    "sl": 45,
    "english": "Gazipur",
    "bangla": "গাজীপুর",
    "mobile": "8801911499560",
    "district": "গাজীপুর",
    "region": "ঢাকা",
    "fullName": "গাজীপুর (Gazipur)"
  },
  {
    "sl": 46,
    "english": "Gharilal",
    "bangla": "ঘড়িলাল",
    "mobile": "8801302355929",
    "district": "সাতক্ষীরা",
    "region": "খুলনা-সাতক্ষীরা",
    "fullName": "ঘড়িলাল (Gharilal)"
  },
  {
    "sl": 47,
    "english": "Ghatura",
    "bangla": "ঘাটুরা",
    "mobile": "8801752190547",
    "district": "ব্রাহ্মণবাড়িয়া- ৩",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "ঘাটুরা (Ghatura)"
  },
  {
    "sl": 48,
    "english": "Helenchakuri",
    "bangla": "হেলেঞ্চাকুড়ি",
    "mobile": "8801715508557",
    "district": "দিনাজপুর-২",
    "region": "দিনাজপুর-পঞ্চগড়",
    "fullName": "হেলেঞ্চাকুড়ি (Helenchakuri)"
  },
  {
    "sl": 49,
    "english": "Hosnabad",
    "bangla": "হোসনাবাদ",
    "mobile": "8801404790829",
    "district": "জামালপুর-১",
    "region": "জামালপুর-টাঙ্গাইল-শেরপুর",
    "fullName": "হোসনাবাদ (Hosnabad)"
  },
  {
    "sl": 50,
    "english": "Islamgonj",
    "bangla": "ইসলামগঞ্জ",
    "mobile": "8801730967090",
    "district": "সিলেট-সুনামগঞ্জ",
    "region": "সিলেট-সুনামগঞ্জ",
    "fullName": "ইসলামগঞ্জ (Islamgonj)"
  },
  {
    "sl": 51,
    "english": "Jamalpur (Habi)",
    "bangla": "জামালপুর হবিগঞ্জ",
    "mobile": "8801786630009",
    "district": "হবিগঞ্জ-মৌলবীবাজার",
    "region": "সিলেট-সুনামগঞ্জ",
    "fullName": "জামালপুর হবিগঞ্জ (Jamalpur (Habi))"
  },
  {
    "sl": 52,
    "english": "Jamalpur Noya",
    "bangla": "জামালপুর নয়াপাড়া",
    "mobile": "8801715013556",
    "district": "জামালপুর-২",
    "region": "জামালপুর-টাঙ্গাইল-শেরপুর",
    "fullName": "জামালপুর নয়াপাড়া (Jamalpur Noya)"
  },
  {
    "sl": 53,
    "english": "Jessore",
    "bangla": "যশোর",
    "mobile": "8801725400642",
    "district": "খুলনা-যশোর",
    "region": "খুলনা-সাতক্ষীরা",
    "fullName": "যশোর (Jessore)"
  },
  {
    "sl": 54,
    "english": "Kabirpur",
    "bangla": "কবিরপুর",
    "mobile": "8801749882882",
    "district": "গাজীপুর",
    "region": "ঢাকা",
    "fullName": "কবিরপুর (Kabirpur)"
  },
  {
    "sl": 55,
    "english": "Kafuria",
    "bangla": "কাফুরিয়া",
    "mobile": "8801799005428",
    "district": "নাটোর-১",
    "region": "বগুড়া-নাটোর",
    "fullName": "কাফুরিয়া (Kafuria)"
  },
  {
    "sl": 56,
    "english": "Kawnia",
    "bangla": "কাউনিয়া",
    "mobile": "8801734083605",
    "district": "বরিশাল-পটুয়াখালী",
    "region": "বরিশাল-পটুয়াখালী",
    "fullName": "কাউনিয়া (Kawnia)"
  },
  {
    "sl": 57,
    "english": "Khakdan",
    "bangla": "খাকদান",
    "mobile": "8801783351775",
    "district": "বড়গুনা",
    "region": "বরিশাল-পটুয়াখালী",
    "fullName": "খাকদান (Khakdan)"
  },
  {
    "sl": 58,
    "english": "Khudra B.Baria",
    "bangla": "ক্ষুদ্র বিবাড়ীয়া",
    "mobile": "8801720392096",
    "district": "ব্রাহ্মণবাড়িয়া-২",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "ক্ষুদ্র বিবাড়ীয়া (Khudra B.Baria)"
  },
  {
    "sl": 59,
    "english": "Khudrapara",
    "bangla": "ক্ষুদ্রপাড়া",
    "mobile": "8801755134280",
    "district": "দিনাজপুর-২",
    "region": "দিনাজপুর-পঞ্চগড়",
    "fullName": "ক্ষুদ্রপাড়া (Khudrapara)"
  },
  {
    "sl": 60,
    "english": "Khulna",
    "bangla": "খুলনা",
    "mobile": "8801710860455",
    "district": "খুলনা-যশোর",
    "region": "খুলনা-সাতক্ষীরা",
    "fullName": "খুলনা (Khulna)"
  },
  {
    "sl": 61,
    "english": "Kodda",
    "bangla": "কোড্ডা",
    "mobile": "8801641742082",
    "district": "ব্রাহ্মণবাড়িয়া-১",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "কোড্ডা (Kodda)"
  },
  {
    "sl": 62,
    "english": "Kodomshahar",
    "bangla": "কদমশহর",
    "mobile": "8801737677399",
    "district": "রাজশাহী-১",
    "region": "রাজশাহী-পাবনা",
    "fullName": "কদমশহর (Kodomshahar)"
  },
  {
    "sl": 63,
    "english": "Komolapukuri",
    "bangla": "কমলাপুকুরী মাড়েয়া",
    "mobile": "8801740181539",
    "district": "পঞ্চগড়",
    "region": "দিনাজপুর-পঞ্চগড়",
    "fullName": "কমলাপুকুরী মাড়েয়া (Komolapukuri)"
  },
  {
    "sl": 64,
    "english": "Koritola",
    "bangla": "কড়িতলা",
    "mobile": "8801772685380",
    "district": "বগুড়া",
    "region": "বগুড়া-নাটোর",
    "fullName": "কড়িতলা (Koritola)"
  },
  {
    "sl": 65,
    "english": "Kotiadi",
    "bangla": "কটিয়াদী",
    "mobile": "8801996495608",
    "district": "কিশোরগঞ্জ-১",
    "region": "কিশোরগঞ্জ",
    "fullName": "কটিয়াদী (Kotiadi)"
  },
  {
    "sl": 66,
    "english": "Koyra",
    "bangla": "কয়ড়া",
    "mobile": "8801757303169",
    "district": "জামালপুর-১",
    "region": "জামালপুর-টাঙ্গাইল-শেরপুর",
    "fullName": "কয়ড়া (Koyra)"
  },
  {
    "sl": 67,
    "english": "Krishnagar",
    "bangla": "কৃষ্ণনগর",
    "mobile": "8801725898256",
    "district": "বরিশাল-পটুয়াখালী",
    "region": "বরিশাল-পটুয়াখালী",
    "fullName": "কৃষ্ণনগর (Krishnagar)"
  },
  {
    "sl": 68,
    "english": "Kukua",
    "bangla": "কুকুয়া",
    "mobile": "8801746967748",
    "district": "বরিশাল-পটুয়াখালী",
    "region": "বরিশাল-পটুয়াখালী",
    "fullName": "কুকুয়া (Kukua)"
  },
  {
    "sl": 69,
    "english": "Kustia",
    "bangla": "কুষ্টিয়া",
    "mobile": "8801712814025",
    "district": "কুষ্টিয়া",
    "region": "কুষ্টিয়া-চূয়াডাঙ্গা",
    "fullName": "কুষ্টিয়া (Kustia)"
  },
  {
    "sl": 70,
    "english": "Kutir Hat",
    "bangla": "কুঠিরহাট",
    "mobile": "8801814320166",
    "district": "কুমিল্লা ও চাঁদপুর",
    "region": "চট্টগ্রাম-কক্সবাজার",
    "fullName": "কুঠিরহাট (Kutir Hat)"
  },
  {
    "sl": 71,
    "english": "Lakkhipur",
    "bangla": "লক্ষীপুর",
    "mobile": "8801311476148",
    "district": "সিলেট-সুনামগঞ্জ",
    "region": "সিলেট-সুনামগঞ্জ",
    "fullName": "লক্ষীপুর (Lakkhipur)"
  },
  {
    "sl": 72,
    "english": "Madartek",
    "bangla": "মাদারটেক",
    "mobile": "8801769696669",
    "district": "ঢাকা মেট্রো",
    "region": "ঢাকা",
    "fullName": "মাদারটেক (Madartek)"
  },
  {
    "sl": 73,
    "english": "Mahigonj",
    "bangla": "মাহীগঞ্জ",
    "mobile": "8801910273153",
    "district": "রংপুর-গাইবান্ধা",
    "region": "রংপুর-গাইবান্ধা",
    "fullName": "মাহীগঞ্জ (Mahigonj)"
  },
  {
    "sl": 74,
    "english": "Mahilla",
    "bangla": "মাহিল্লা",
    "mobile": "8801302355929",
    "district": "চট্টগ্রাম ও পার্বত্য",
    "region": "চট্টগ্রাম-কক্সবাজার",
    "fullName": "মাহিল্লা (Mahilla)"
  },
  {
    "sl": 75,
    "english": "Meergang",
    "bangla": "মিরগাং",
    "mobile": "8801933307434",
    "district": "সাতক্ষীরা",
    "region": "খুলনা-সাতক্ষীরা",
    "fullName": "মিরগাং (Meergang)"
  },
  {
    "sl": 76,
    "english": "Merigacha",
    "bangla": "মেরীগাছা",
    "mobile": "8801792892351",
    "district": "নাটোর-২",
    "region": "বগুড়া-নাটোর",
    "fullName": "মেরীগাছা (Merigacha)"
  },
  {
    "sl": 77,
    "english": "Mirpur",
    "bangla": "মিরপুর",
    "mobile": "8801721737925",
    "district": "ঢাকা মেট্রো",
    "region": "ঢাকা",
    "fullName": "মিরপুর (Mirpur)"
  },
  {
    "sl": 78,
    "english": "Moharajpur",
    "bangla": "মহারাজপুর",
    "mobile": "8801792892351",
    "district": "নাটোর-২",
    "region": "বগুড়া-নাটোর",
    "fullName": "মহারাজপুর (Moharajpur)"
  },
  {
    "sl": 79,
    "english": "Morail",
    "bangla": "মৌড়াইল",
    "mobile": "8801712914351",
    "district": "ব্রাহ্মণবাড়িয়া- ৩",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "মৌড়াইল (Morail)"
  },
  {
    "sl": 80,
    "english": "Mymensingh",
    "bangla": "ময়মনসিংহ",
    "mobile": "8801703631930",
    "district": "Mymensingh-1",
    "region": "ময়মনসিংহ-নেত্রকোনা",
    "fullName": "ময়মনসিংহ (Mymensingh)"
  },
  {
    "sl": 81,
    "english": "Nabinagar",
    "bangla": "নবীনগর",
    "mobile": "8801716427380",
    "district": "ব্রাহ্মণবাড়িয়া-২",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "নবীনগর (Nabinagar)"
  },
  {
    "sl": 82,
    "english": "Nakala",
    "bangla": "নকলা",
    "mobile": "8801739854588",
    "district": "Mymensingh-1",
    "region": "ময়মনসিংহ-নেত্রকোনা",
    "fullName": "নকলা (Nakala)"
  },
  {
    "sl": 83,
    "english": "Nakhalpara",
    "bangla": "নাখালপাড়া",
    "mobile": "8801787651186",
    "district": "ঢাকা মেট্রো",
    "region": "ঢাকা",
    "fullName": "নাখালপাড়া (Nakhalpara)"
  },
  {
    "sl": 84,
    "english": "Narayangonj",
    "bangla": "নারাণয়গঞ্জ",
    "mobile": "8801621344330",
    "district": "নারায়ণগঞ্জ ও নরসিংদি",
    "region": "ঢাকা",
    "fullName": "নারাণয়গঞ্জ (Narayangonj)"
  },
  {
    "sl": 85,
    "english": "Narsingdi",
    "bangla": "নরসিংদি",
    "mobile": "8801611338988",
    "district": "নারায়ণগঞ্জ ও নরসিংদি",
    "region": "ঢাকা",
    "fullName": "নরসিংদি (Narsingdi)"
  },
  {
    "sl": 86,
    "english": "Naserabad",
    "bangla": "নাসেরাবাদ",
    "mobile": "8801858007928",
    "district": "কুষ্টিয়া",
    "region": "কুষ্টিয়া-চূয়াডাঙ্গা",
    "fullName": "নাসেরাবাদ (Naserabad)"
  },
  {
    "sl": 87,
    "english": "Nasirpur",
    "bangla": "নাসিরপুর",
    "mobile": "8801785526142",
    "district": "ব্রাহ্মণবাড়িয়া- ৩",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "নাসিরপুর (Nasirpur)"
  },
  {
    "sl": 88,
    "english": "Natai",
    "bangla": "নাটাই",
    "mobile": "8801715290460",
    "district": "ব্রাহ্মণবাড়িয়া- ৩",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "নাটাই (Natai)"
  },
  {
    "sl": 89,
    "english": "Nazirpur",
    "bangla": "নাজিরপুর",
    "mobile": "8801761457815",
    "district": "নাটোর-২",
    "region": "বগুড়া-নাটোর",
    "fullName": "নাজিরপুর (Nazirpur)"
  },
  {
    "sl": 90,
    "english": "Netrokona",
    "bangla": "নেত্রকোনা",
    "mobile": "8801945082418",
    "district": "Mymensingh-2",
    "region": "ময়মনসিংহ-নেত্রকোনা",
    "fullName": "নেত্রকোনা (Netrokona)"
  },
  {
    "sl": 91,
    "english": "Newsonatola",
    "bangla": "নিউসোনাতলা",
    "mobile": "8801707071788",
    "district": "বগুড়া",
    "region": "বগুড়া-নাটোর",
    "fullName": "নিউসোনাতলা (Newsonatola)"
  },
  {
    "sl": 92,
    "english": "Noornagar Ishw",
    "bangla": "নূরনগর ঈশ্বরদী",
    "mobile": "8801737911554",
    "district": "রাজশাহী-১",
    "region": "রাজশাহী-পাবনা",
    "fullName": "নূরনগর ঈশ্বরদী (Noornagar Ishw)"
  },
  {
    "sl": 93,
    "english": "Pabna",
    "bangla": "পাবনা",
    "mobile": "8801710795611",
    "district": "রাজশাহী-২",
    "region": "রাজশাহী-পাবনা",
    "fullName": "পাবনা (Pabna)"
  },
  {
    "sl": 94,
    "english": "Pagulia",
    "bangla": "পাগুলিয়া",
    "mobile": "8801711810740",
    "district": "হবিগঞ্জ-মৌলবীবাজার",
    "region": "সিলেট-সুনামগঞ্জ",
    "fullName": "পাগুলিয়া (Pagulia)"
  },
  {
    "sl": 95,
    "english": "Patenga",
    "bangla": "পতেঙ্গা",
    "mobile": "8801799532442",
    "district": "চট্টগ্রাম ও পার্বত্য",
    "region": "চট্টগ্রাম-কক্সবাজার",
    "fullName": "পতেঙ্গা (Patenga)"
  },
  {
    "sl": 96,
    "english": "Patuakhali",
    "bangla": "পটুয়াখালী",
    "mobile": "8801724202635",
    "district": "বড়গুনা",
    "region": "বরিশাল-পটুয়াখালী",
    "fullName": "পটুয়াখালী (Patuakhali)"
  },
  {
    "sl": 97,
    "english": "Purrulia",
    "bangla": "পুরুলিয়া",
    "mobile": "8801772225239",
    "district": "নাটোর-২",
    "region": "বগুড়া-নাটোর",
    "fullName": "পুরুলিয়া (Purrulia)"
  },
  {
    "sl": 98,
    "english": "Raghunathpurbag",
    "bangla": "রঘুনাথপুরবাগ",
    "mobile": "8801928693455",
    "district": "খুলনা-যশোর",
    "region": "খুলনা-সাতক্ষীরা",
    "fullName": "রঘুনাথপুরবাগ (Raghunathpurbag)"
  },
  {
    "sl": 99,
    "english": "Rajshahi",
    "bangla": "রাজশাহী",
    "mobile": "8801755800281",
    "district": "রাজশাহী-১",
    "region": "রাজশাহী-পাবনা",
    "fullName": "রাজশাহী (Rajshahi)"
  },
  {
    "sl": 100,
    "english": "Rampur",
    "bangla": "রামপুর",
    "mobile": "8801715838376",
    "district": "দিনাজপুর-১",
    "region": "দিনাজপুর-পঞ্চগড়",
    "fullName": "রামপুর (Rampur)"
  },
  {
    "sl": 101,
    "english": "Rangpur",
    "bangla": "রংপুর",
    "mobile": "8801715385200",
    "district": "রংপুর-গাইবান্ধা",
    "region": "রংপুর-গাইবান্ধা",
    "fullName": "রংপুর (Rangpur)"
  },
  {
    "sl": 102,
    "english": "Rangtia",
    "bangla": "রাংটিয়া",
    "mobile": "8801966955573",
    "district": "জামালপুর-২",
    "region": "জামালপুর-টাঙ্গাইল-শেরপুর",
    "fullName": "রাংটিয়া (Rangtia)"
  },
  {
    "sl": 103,
    "english": "Rekabi Bazar",
    "bangla": "রিকাবী বাজার",
    "mobile": "8801681683526",
    "district": "নারায়ণগঞ্জ ও নরসিংদি",
    "region": "ঢাকা",
    "fullName": "রিকাবী বাজার (Rekabi Bazar)"
  },
  {
    "sl": 104,
    "english": "Saidpur",
    "bangla": "সৈয়দপুর",
    "mobile": "8801718938593",
    "district": "নিলফামারী-রংপুর",
    "region": "রংপুর-গাইবান্ধা",
    "fullName": "সৈয়দপুর (Saidpur)"
  },
  {
    "sl": 105,
    "english": "Santoshpur",
    "bangla": "সন্তোষপুর",
    "mobile": "8801911622828",
    "district": "চুয়াডাঙ্গা",
    "region": "কুষ্টিয়া-চূয়াডাঙ্গা",
    "fullName": "সন্তোষপুর (Santoshpur)"
  },
  {
    "sl": 106,
    "english": "Sarail",
    "bangla": "সরাইল",
    "mobile": "8801731146644",
    "district": "ব্রাহ্মণবাড়িয়া- ৩",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "সরাইল (Sarail)"
  },
  {
    "sl": 107,
    "english": "Sarishabari",
    "bangla": "সরিষাবাড়ী",
    "mobile": "8801319061564",
    "district": "জামালপুর-১",
    "region": "জামালপুর-টাঙ্গাইল-শেরপুর",
    "fullName": "সরিষাবাড়ী (Sarishabari)"
  },
  {
    "sl": 108,
    "english": "Sarporajpur",
    "bangla": "সর্পরাজপুর",
    "mobile": "8801745600840",
    "district": "খুলনা-যশোর",
    "region": "খুলনা-সাতক্ষীরা",
    "fullName": "সর্পরাজপুর (Sarporajpur)"
  },
  {
    "sl": 109,
    "english": "Satkhira",
    "bangla": "সাতক্ষীরা",
    "mobile": "8801913702294",
    "district": "সাতক্ষীরা",
    "region": "খুলনা-সাতক্ষীরা",
    "fullName": "সাতক্ষীরা (Satkhira)"
  },
  {
    "sl": 110,
    "english": "Savar",
    "bangla": "সাভার",
    "mobile": "8801821730301",
    "district": "গাজীপুর",
    "region": "ঢাকা",
    "fullName": "সাভার (Savar)"
  },
  {
    "sl": 111,
    "english": "Sayedpur Bag",
    "bangla": "সৈয়দপুর বাগমারা",
    "mobile": "8801737-911554",
    "district": "রাজশাহী-২",
    "region": "রাজশাহী-পাবনা",
    "fullName": "সৈয়দপুর বাগমারা (Sayedpur Bag)"
  },
  {
    "sl": 112,
    "english": "Sengua",
    "bangla": "সেঙ্গুয়া",
    "mobile": "8801622249412",
    "district": "জামালপুর-১",
    "region": "জামালপুর-টাঙ্গাইল-শেরপুর",
    "fullName": "সেঙ্গুয়া (Sengua)"
  },
  {
    "sl": 113,
    "english": "Shahbajpur",
    "bangla": "শাহাবাজপুর",
    "mobile": "8801786737682",
    "district": "ব্রাহ্মণবাড়িয়া-২",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "শাহাবাজপুর (Shahbajpur)"
  },
  {
    "sl": 114,
    "english": "Shailmari",
    "bangla": "শৈলমারী",
    "mobile": "8801719917095",
    "district": "চুয়াডাঙ্গা",
    "region": "কুষ্টিয়া-চূয়াডাঙ্গা",
    "fullName": "শৈলমারী (Shailmari)"
  },
  {
    "sl": 115,
    "english": "Shalgaon",
    "bangla": "শালগাঁও",
    "mobile": "8801917439166",
    "district": "ব্রাহ্মণবাড়িয়া- ৩",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "শালগাঁও (Shalgaon)"
  },
  {
    "sl": 116,
    "english": "Shalshiri",
    "bangla": "শালশিঁড়ি",
    "mobile": "8801318948676",
    "district": "পঞ্চগড়",
    "region": "দিনাজপুর-পঞ্চগড়",
    "fullName": "শালশিঁড়ি (Shalshiri)"
  },
  {
    "sl": 117,
    "english": "Shaympur",
    "bangla": "শ্যামপুর",
    "mobile": "8801740963535",
    "district": "রংপুর-গাইবান্ধা",
    "region": "রংপুর-গাইবান্ধা",
    "fullName": "শ্যামপুর (Shaympur)"
  },
  {
    "sl": 118,
    "english": "Shelbarsh",
    "bangla": "সেলবরষ",
    "mobile": "8801715833067",
    "district": "Mymensingh-2",
    "region": "ময়মনসিংহ-নেত্রকোনা",
    "fullName": "সেলবরষ (Shelbarsh)"
  },
  {
    "sl": 119,
    "english": "Sirajgonj",
    "bangla": "সিরাজগঞ্জ",
    "mobile": "8801798488283",
    "district": "বগুড়া",
    "region": "বগুড়া-নাটোর",
    "fullName": "সিরাজগঞ্জ (Sirajgonj)"
  },
  {
    "sl": 120,
    "english": "Sohagi",
    "bangla": "সোহাগী",
    "mobile": "8801720028872",
    "district": "Mymensingh-2",
    "region": "ময়মনসিংহ-নেত্রকোনা",
    "fullName": "সোহাগী (Sohagi)"
  },
  {
    "sl": 121,
    "english": "Sonargaon",
    "bangla": "সোনারগাঁও",
    "mobile": "8801931261620",
    "district": "নারায়ণগঞ্জ ও নরসিংদি",
    "region": "ঢাকা",
    "fullName": "সোনারগাঁও (Sonargaon)"
  },
  {
    "sl": 122,
    "english": "Sunderban",
    "bangla": "সুন্দরবন",
    "mobile": "8801927367565",
    "district": "সাতক্ষীরা",
    "region": "খুলনা-সাতক্ষীরা",
    "fullName": "সুন্দরবন (Sunderban)"
  },
  {
    "sl": 123,
    "english": "Sylhet",
    "bangla": "সিলেট",
    "mobile": "8801780256621",
    "district": "সিলেট-সুনামগঞ্জ",
    "region": "সিলেট-সুনামগঞ্জ",
    "fullName": "সিলেট (Sylhet)"
  },
  {
    "sl": 124,
    "english": "Taherabad",
    "bangla": "তাহেরাবাদ",
    "mobile": "8801745449498",
    "district": "রাজশাহী-১",
    "region": "রাজশাহী-পাবনা",
    "fullName": "তাহেরাবাদ (Taherabad)"
  },
  {
    "sl": 125,
    "english": "Talshahar",
    "bangla": "তালশহর",
    "mobile": "8801721634410",
    "district": "ব্রাহ্মণবাড়িয়া-২",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "তালশহর (Talshahar)"
  },
  {
    "sl": 126,
    "english": "Taragonj",
    "bangla": "তারাগঞ্জ",
    "mobile": "8801740052823",
    "district": "নিলফামারী-রংপুর",
    "region": "রংপুর-গাইবান্ধা",
    "fullName": "তারাগঞ্জ (Taragonj)"
  },
  {
    "sl": 127,
    "english": "Tarua",
    "bangla": "তারুয়া",
    "mobile": "8801713603938",
    "district": "ব্রাহ্মণবাড়িয়া-২",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "তারুয়া (Tarua)"
  },
  {
    "sl": 128,
    "english": "Tebaria",
    "bangla": "তেবাড়ীয়া",
    "mobile": "8801990579665",
    "district": "নাটোর-১",
    "region": "বগুড়া-নাটোর",
    "fullName": "তেবাড়ীয়া (Tebaria)"
  },
  {
    "sl": 129,
    "english": "Tejgaon",
    "bangla": "তেজগাঁও",
    "mobile": "8801929136075",
    "district": "ঢাকা মেট্রো",
    "region": "ঢাকা",
    "fullName": "তেজগাঁও (Tejgaon)"
  },
  {
    "sl": 130,
    "english": "Terogati",
    "bangla": "তেরগাতী",
    "mobile": "8801752006608",
    "district": "কিশোরগঞ্জ-১",
    "region": "কিশোরগঞ্জ",
    "fullName": "তেরগাতী (Terogati)"
  },
  {
    "sl": 131,
    "english": "Uthali",
    "bangla": "উথলী",
    "mobile": "8801716951375",
    "district": "চুয়াডাঙ্গা",
    "region": "কুষ্টিয়া-চূয়াডাঙ্গা",
    "fullName": "উথলী (Uthali)"
  },
  {
    "sl": 132,
    "english": "Uttar Bhabanipur",
    "bangla": "উত্তরভবানীপুর",
    "mobile": "8801733680152",
    "district": "কুষ্টিয়া",
    "region": "কুষ্টিয়া-চূয়াডাঙ্গা",
    "fullName": "উত্তরভবানীপুর (Uttar Bhabanipur)"
  },
  {
    "sl": 133,
    "english": "Uttara Baherchar",
    "bangla": "উত্তর বাহেরচর",
    "mobile": "8801728216844",
    "district": "গাজীপুর",
    "region": "ঢাকা",
    "fullName": "উত্তর বাহেরচর (Uttara Baherchar)"
  },
  {
    "sl": 134,
    "english": "Vadughar",
    "bangla": "ভাদুঘর",
    "mobile": "8801727277895",
    "district": "ব্রাহ্মণবাড়িয়া-১",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "ভাদুঘর (Vadughar)"
  },
  {
    "sl": 135,
    "english": "Vetkhali",
    "bangla": "ভেটখালী",
    "mobile": "8801724707199",
    "district": "সাতক্ষীরা",
    "region": "খুলনা-সাতক্ষীরা",
    "fullName": "ভেটখালী (Vetkhali)"
  },
  {
    "sl": 136,
    "english": "Boiragirchar",
    "bangla": "বৈরাগীরচর",
    "mobile": "8801738096928",
    "district": "কিশোরগঞ্জ-২",
    "region": "কিশোরগঞ্জ",
    "fullName": "বৈরাগীরচর (Boiragirchar)"
  },
  {
    "sl": 137,
    "english": "Maulvi Para",
    "bangla": "মৌলবীপাড়া",
    "mobile": "8801718486569",
    "district": "ব্রাহ্মণবাড়িয়া-১",
    "region": "ব্রাহ্মণবাড়িয়া",
    "fullName": "মৌলবীপাড়া (Maulvi Para)"
  },
  {
    "sl": 138,
    "english": "Mohishakhola",
    "bangla": "মহিষাখোলা",
    "mobile": "8801795144564",
    "district": "কুষ্টিয়া",
    "region": "কুষ্টিয়া-চূয়াডাঙ্গা",
    "fullName": "মহিষাখোলা (Mohishakhola)"
  },
  {
    "sl": 139,
    "english": "Cox's Bazar",
    "bangla": "কক্সবাজার",
    "mobile": "8801828060801",
    "district": "চট্টগ্রাম ও পার্বত্য",
    "region": "চট্টগ্রাম-কক্সবাজার",
    "fullName": "কক্সবাজার (Cox's Bazar)"
  }
];

/**
 * Normalizes phone numbers for forgiving comparison (handles 88 prefix, dashes, spaces)
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("880")) return digits.slice(2);
  if (digits.startsWith("88")) return digits.slice(2);
  return digits;
}

/**
 * Validates credentials and returns authenticated user or null
 */
export function authenticateUser(
  usernameInput: string,
  passwordInput: string,
  customUsersList?: MajlisUserRecord[]
): AuthUser | null {
  const u = usernameInput.trim();
  const p = passwordInput.trim();
  if (!u || !p) return null;

  // 1. Check Admin credentials (username: admin, password: admin)
  if (u.toLowerCase() === "admin" && p === "admin") {
    return {
      username: "admin",
      role: "admin",
    };
  }

  // 2. Check Majlis user credentials
  const users = customUsersList && customUsersList.length > 0 ? customUsersList : INITIAL_MAJLIS_USERS;
  const normUser = u.toLowerCase().replace(/[\s_-]+/g, "");
  const normPass = normalizePhone(p);

  const matched = users.find((m) => {
    const normEng = m.english.toLowerCase().replace(/[\s_-]+/g, "");
    const normBng = m.bangla.toLowerCase().replace(/[\s_-]+/g, "");
    const normFull = m.fullName.toLowerCase().replace(/[\s_-]+/g, "");

    const usernameMatches = normEng === normUser || normBng === normUser || normFull === normUser;
    if (!usernameMatches) return false;

    // Check exact password or normalized digits
    const exactMatch = m.mobile.trim() === p;
    const normMobile = normalizePhone(m.mobile);
    const phoneMatches = normMobile === normPass || (normMobile.endsWith(normPass) && normPass.length >= 10);

    // Chittagong historical number fallback
    const chittagongFallback = normEng === "chittagong" && (normPass.endsWith("1860862785") || normPass.endsWith("1734416398"));

    return exactMatch || phoneMatches || chittagongFallback;
  });

  if (matched) {
    return {
      username: matched.english,
      role: "majlis",
      majlisEnglish: matched.english,
      majlisBangla: matched.bangla,
      majlisFullName: matched.fullName,
      district: matched.district,
      region: matched.region,
    };
  }

  return null;
}
