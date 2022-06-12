const puppeteer = require("puppeteer");
const fs = require("fs");

const pass = JSON.parse(fs.readFileSync("./pass.json").toString());

(async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = (await browser.pages())[0];
	await page.goto("https://amalieskram-vgs.inschool.visma.no/");

	await page.waitForSelector("#login-with-feide-button");
	await page.click("#login-with-feide-button");

	await page.waitForSelector("#username");
	await page.type("#username", pass.username);
	await page.type("#password", pass.pass);

	await page.evaluate(() => {
		document
			.getElementsByClassName("button-primary breathe-top")[0]
			.click();
	});

	await page.waitForSelector(
		"#RightContentPanel > div > div.vs-Navigation--Wrapper > div > button > div.vs-Navigation-Header-LogoWrapper > svg > path"
	);

	await page.waitForTimeout(3000);

	await page.evaluate(() => {
		try {
			const el = document.querySelector(
				"html > body > div:nth-of-type(5) > button:nth-of-type(2)"
			);

			if (el) el.click();
		} catch (error) {}
	});

	await page.waitForTimeout(1000);

	function getWeekData() {
		const days = document.getElementsByClassName(
			"Timetable-TimetableDays_day"
		);

		const dayNames = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag"];

		let weekOb = {
			weekNr: document
				.getElementsByClassName(
					"subheading2 userTimetable_currentWeek"
				)[0]
				.innerText.split(",")[0]
				.replace("UKE ", ""),
			days: [],
		};

		for (let i = 0; i < days.length; i++) {
			const day = days[i];

			let dayOb = {
				name: dayNames[i],
				classes: [],
			};

			const classes = day.children[0].children;

			for (let x = 0; x < classes.length; x++) {
				const sClass = classes[x];

				let classOb = {
					dato: "",
					time: "",
					room: "",
					name: "",
				};

				const data = sClass.children[1].innerText;

				classOb.dato = data.split(" Starter ")[1].split(" klokken")[0];
				classOb.time =
					data.split(" klokken ")[1].split(" og")[0] +
					"-" +
					data.split(" slutter ")[1].trim();

				if (data.includes("Aktivitet")) {
					classOb.room = "Aktivitet";
					classOb.name = data.split(".")[0].trim();
				} else {
					classOb.room = data.split(" rom ")[1].split(".")[0];
					classOb.name = data.split(" i rom ")[0].trim();
				}

				dayOb.classes.push(classOb);
			}

			weekOb.days.push(dayOb);
		}

		return weekOb;
	}

	let foresight = 3;

	let weeks = [];

	for (let i = 0; i < foresight; i++) {
		const data = await page.evaluate(getWeekData);
		weeks.push(data);

		await page.click("#nextweek");
		await page.waitForSelector(
			"#dashboard-widget-TimetableWidget-panel-hiddenArea > div > div > div > div > div:nth-child(2) > div.timetable-grid"
		);
	}

	fs.writeFileSync("data.json", JSON.stringify(weeks));

	browser.close();
})();