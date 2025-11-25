const { Labor } = require('./src/models');
const { sequelize } = require('./src/database');

const cities = ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市'];
const districts = ['中正區', '大安區', '信義區', '板橋區', '桃園區', '中壢區', '西屯區', '北區', '安平區', '前金區'];
const roads = ['中正路', '中山路', '中華路', '民權路', '民生路', '建國路', '和平路', '信義路', '仁愛路'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateAddress = () => {
    const city = getRandomElement(cities);
    const district = getRandomElement(districts);
    const road = getRandomElement(roads);
    const section = getRandomInt(1, 5);
    const lane = getRandomInt(1, 300);
    const no = getRandomInt(1, 500);
    const floor = getRandomInt(1, 15);

    return `${city}${district}${road}${section}段${lane}巷${no}號${floor}樓`;
};

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const labors = await Labor.findAll();
        console.log(`Found ${labors.length} labors.`);

        for (const labor of labors) {
            const address = generateAddress();
            await labor.update({ residence_address: address });
            // console.log(`Updated ${labor.name_zh}: ${address}`);
        }

        console.log('All labors updated with random addresses.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

run();
