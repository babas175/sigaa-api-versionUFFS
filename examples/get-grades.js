/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
const Sigaa = require("sigaa-api").Sigaa;

const sigaa = new Sigaa({
  url: "https://sigaa.uffs.edu.br",
  institution: 'UFFS'
});

// coloque seu usuário
const username = '';
const password = '';

// Serve só para exibir as notas no console
const printGrades = (gradesGroups) => {
  for (const gradesGroup of gradesGroups) {
    console.log("->" + gradesGroup.name);
    switch (gradesGroup.type) {
      case "only-average":
        console.log(gradesGroup.value);
        break;

      case "weighted-average":
        for (const grade of gradesGroup.grades) {
          console.log("-" + grade.name);
          console.log("peso: " + grade.weight);
          console.log(grade.value);
        }

        console.log("média:" + gradesGroup.value);

        break;

      case "sum-of-grades":
        for (const grade of gradesGroup.grades) {
          console.log("-" + grade.name);
          console.log("Valor máximo: " + grade.maxValue);
          console.log(grade.value);
        }

        console.log("soma:" + gradesGroup.value);
        break;
    }
    console.log(""); // Para espaçar as linhas
  }
};

const main = async () => {
  const account = await sigaa.login(username, password); // login

  const activeBonds = await account.getActiveBonds();
  for (const bond of activeBonds) {
    console.log(">Vínculos ativos");
    if (bond.type === "student") {
      console.log("Matrícula do vínculo: " + bond.registration);
      console.log("Curso do vínculo: " + bond.program);
    } else {
      console.log("vínculo de professor");
    }
  }

  const inactiveBonds = await account.getInactiveBonds();

  for (const bond of inactiveBonds) {
    console.log(">Vínculos inativos");
    if (bond.type === "student") {
      console.log("Matrícula do vínculo: " + bond.registration);
      console.log("Curso do vínculo: " + bond.program);
    } else {
      console.log("vínculo de professor");
    }
  }
  for (let i = 0; i < (await activeBonds[0].getCourses()).length; i++) {
      const course = (await activeBonds[0].getCourses())[i];
      console.log(course.title);
      printGrades(await course.getGrades());
  }

  for (let i = 0; i < (await inactiveBonds[0].getCourses()).length; i++) {
      const course = (await inactiveBonds[0].getCourses())[i];
      console.log(course.title);
      printGrades(await course.getGrades());
  }

  // Encerra a sessão
  await account.logoff();
};

main().catch((err) => {
  if (err) console.log(err);
});