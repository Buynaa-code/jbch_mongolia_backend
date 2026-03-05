const mongoose = require('mongoose');
require('dotenv').config();

const { connectDB } = require('../config');
const Song = require('../models/Song.model');
const Event = require('../models/Event.model');
const Verse = require('../models/Verse.model');
const Program = require('../models/Program.model');
const Sermon = require('../models/Sermon.model');
const User = require('../models/User.model');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing data
    await Promise.all([
      Song.deleteMany({}),
      Event.deleteMany({}),
      Verse.deleteMany({}),
      Program.deleteMany({}),
      Sermon.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create admin user if not exists
    let adminUser = await User.findOne({ email: 'admin@jbch.mn' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@jbch.mn',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Created admin user: admin@jbch.mn / admin123');
    }

    // ============ SONGS ============
    const songs = await Song.insertMany([
      {
        title: 'Эзэн миний хоньчин',
        artist: 'Магтаалын баг',
        genre: 'praise',
        duration: 272,
        lyrics: 'Эзэн миний хоньчин\nБи дутагдахгүй\nНогоон бэлчээрт\nНамайг хэвтүүлнэ\n\nТайван усны дэргэд\nНамайг хөтөлнө\nМиний сэтгэлийг\nСэргээн босгоно',
        isFeatured: true,
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        title: 'Алдар Бурханд',
        artist: 'Магтаалын баг',
        genre: 'worship',
        duration: 225,
        lyrics: 'Алдар Бурханд\nМагтаал өргөе\nТэнгэр газрын Эзэн\nМөнхөд магтагдах болтугай',
        isFeatured: true,
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        title: 'Миний зүрхний дуу',
        artist: 'Залуучуудын баг',
        genre: 'contemporary',
        duration: 252,
        lyrics: 'Миний зүрхний дуу\nЧамд л зориулъя\nМиний амьдралын магтаал\nЗөвхөн Танд',
        isFeatured: true,
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        title: 'Бурханы хайр',
        artist: 'Хүүхдийн найрал',
        genre: 'children',
        duration: 178,
        lyrics: 'Бурханы хайр их агуу\nНамайг хайрладаг\nБурханы хайр мөнхийн\nЗүрхэнд минь байна',
        isFeatured: false,
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        title: 'Агуу их Бурхан',
        artist: 'Сүмийн найрал',
        genre: 'hymn',
        duration: 315,
        lyrics: 'Агуу их Бурхан\nОгторгуй газрыг бүтээсэн\nТэнгэр газрын алдар\nТаны мутарт байна',
        isFeatured: true,
        isActive: true,
        createdBy: adminUser._id,
      },
    ]);
    console.log(`Created ${songs.length} songs`);

    // ============ EVENTS ============
    const now = new Date();
    const events = await Event.insertMany([
      {
        title: 'Ням гарагийн үйлчлэл',
        description: 'Бүх гэр бүлийн хамт Бурханыг магтан алдаршуулах үйлчлэл. Хүүхдийн ангиуд, залуучуудын цуглаан байна.',
        type: 'worship',
        startDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        endDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        location: {
          name: 'JBCH Сүм',
          address: 'Улаанбаатар хот, Сүхбаатар дүүрэг',
        },
        isFeatured: true,
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        title: 'Библи судлал',
        description: 'Долоо хоног бүрийн Лхагва гарагт болдог Библи судлалын цуглаан. Энэ удаа Ром номыг судална.',
        type: 'bible_study',
        startDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000),
        location: {
          name: 'JBCH Сүм',
          address: 'Улаанбаатар хот',
        },
        isFeatured: false,
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        title: 'Залуучуудын семинар',
        description: 'Залуучуудад зориулсан онцгой семинар. Сэдэв: "Итгэлтэй амьдрах нь"',
        type: 'seminar',
        startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        location: {
          name: 'JBCH Сүм - Залуучуудын танхим',
          address: 'Улаанбаатар хот',
        },
        speaker: {
          name: 'Пастор Батбаяр',
          title: 'Залуучуудын пастор',
        },
        isFeatured: true,
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        title: 'Залбирлын уулзалт',
        description: 'Сүмийн гишүүдийн хамтын залбирлын цуглаан',
        type: 'prayer',
        startDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
        location: {
          name: 'JBCH Сүм',
          address: 'Улаанбаатар хот',
        },
        isFeatured: false,
        isActive: true,
        createdBy: adminUser._id,
      },
    ]);
    console.log(`Created ${events.length} events`);

    // ============ VERSES ============
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const verses = await Verse.insertMany([
      {
        reference: 'Иохан 3:16',
        book: 'Иохан',
        chapter: 3,
        verseStart: 16,
        text: 'Бурхан ертөнцийг үнэхээр хайрласан тул цорын ганц Хүүгээ өгсөн. Ингэснээр Хүүд итгэгч хэн ч мөхөхгүй, харин мөнх амьтай болох юм.',
        theme: 'love',
        isVerseOfWeek: true,
        weekOf: startOfWeek,
        reflection: 'Бурханы хайр бидэнд хэр их болохыг энэ ишлэл харуулж байна.',
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        reference: 'Дуулал 23:1-3',
        book: 'Дуулал',
        chapter: 23,
        verseStart: 1,
        verseEnd: 3,
        text: 'ЭЗЭН бол миний хоньчин. Би дутагдахгүй. Тэр намайг ногоон бэлчээрт хэвтүүлж, тайван усны хажууд хөтөлнө. Тэр миний сэтгэлийг сэргээж, Өөрийнхөө нэрийн төлөө зөв замаар намайг удирдана.',
        theme: 'peace',
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        reference: 'Филиппой 4:13',
        book: 'Филиппой',
        chapter: 4,
        verseStart: 13,
        text: 'Намайг хүчирхэгжүүлдэг Түүгээр би бүх юмыг хийж чадна.',
        theme: 'strength',
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        reference: 'Ром 8:28',
        book: 'Ром',
        chapter: 8,
        verseStart: 28,
        text: 'Бурханыг хайрладаг хүмүүст, Түүний зорилгоор дуудагдсан хүмүүст бүх юм хамтдаа сайн үйлд нь ажилладаг гэдгийг бид мэднэ.',
        theme: 'faith',
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        reference: 'Исаиа 41:10',
        book: 'Исаиа',
        chapter: 41,
        verseStart: 10,
        text: 'Бүү ай, учир нь Би чамтай хамт байна. Бүү сандар, учир нь Би бол чиний Бурхан. Би чамайг хүчирхэгжүүлнэ. Тийм ээ, Би чамд тусална. Тийм ээ, Би чамайг зөв баруун мутраараа дэмжинэ.',
        theme: 'strength',
        isActive: true,
        createdBy: adminUser._id,
      },
    ]);
    console.log(`Created ${verses.length} verses`);

    // ============ PROGRAMS ============
    const programs = await Program.insertMany([
      {
        weekOf: startOfWeek,
        dayOfWeek: 0, // Sunday
        serviceType: 'sunday_morning',
        title: 'Ням гарагийн өглөөний үйлчлэл',
        theme: 'Итгэлийн амьдрал',
        items: [
          { time: '10:00', title: 'Магтан дуулах', order: 1 },
          { time: '10:30', title: 'Библи уншлага', order: 2 },
          { time: '10:45', title: 'Номлол', speaker: 'Пастор Батбаяр', order: 3 },
          { time: '11:30', title: 'Дуудлага ба залбирал', order: 4 },
        ],
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        weekOf: startOfWeek,
        dayOfWeek: 3, // Wednesday
        serviceType: 'wednesday',
        title: 'Лхагва гарагийн Библи судлал',
        theme: 'Ром ном',
        items: [
          { time: '19:00', title: 'Магтаал', order: 1 },
          { time: '19:15', title: 'Библи судлал', speaker: 'Ахлагч Болд', order: 2 },
          { time: '20:00', title: 'Бүлгийн хэлэлцүүлэг', order: 3 },
        ],
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        weekOf: startOfWeek,
        dayOfWeek: 5, // Friday
        serviceType: 'friday_youth',
        title: 'Залуучуудын цуглаан',
        theme: 'Залуу насанд итгэлтэй',
        items: [
          { time: '19:00', title: 'Магтан дуулах', order: 1 },
          { time: '19:30', title: 'Зааварчилгаа', speaker: 'Залуучуудын удирдагч', order: 2 },
          { time: '20:00', title: 'Бүлгийн үйл ажиллагаа', order: 3 },
        ],
        isActive: true,
        createdBy: adminUser._id,
      },
    ]);
    console.log(`Created ${programs.length} programs`);

    // ============ SERMONS ============
    const sermons = await Sermon.insertMany([
      {
        title: 'Итгэлийн хүч',
        preacher: 'Пастор Батбаяр',
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        duration: 2730,
        description: 'Итгэлээр амьдрах тухай номлол. Еврей 11-р бүлгийн үндсэн дээр.',
        bibleReference: 'Еврей 11:1-6',
        series: 'Итгэлийн аялал',
        isFeatured: true,
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        title: 'Хайрын зам',
        preacher: 'Пастор Оюунбилэг',
        date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        duration: 2295,
        description: 'Бурханы хайр, бидний хариу хайрын тухай',
        bibleReference: '1 Коринт 13',
        isFeatured: false,
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        title: 'Залбирлын амьдрал',
        preacher: 'Пастор Батбаяр',
        date: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
        duration: 2565,
        description: 'Залбирлын ач холбогдол ба практик',
        bibleReference: 'Матай 6:5-15',
        series: 'Залбирлын хүч',
        isFeatured: true,
        isActive: true,
        createdBy: adminUser._id,
      },
    ]);
    console.log(`Created ${sermons.length} sermons`);

    console.log('\n✅ Seed completed successfully!');
    console.log('Admin login: admin@jbch.mn / admin123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
