'use strict';

// Требует node.js и пакеты mkdirp, rmdir
// Пакет mkdirp: https://www.npmjs.com/package/mkdirp#install — установить глобально или прописать установку в package.json, в секции devDependencies
// Пакет rmdir: https://github.com/dreamerslab/node.rmdir — установить глобально или прописать установку в package.json, в секции devDependencies
// Использование:
//   - поместить этот файл в корень проекта
//   - исправить пути к генерируемым папкам и файлам, если блоки проекта лежат не в ./src/components/
//   - в терминале, будучи в корневой папке проекта, выполнить node cb.js [имя блока] [доп. расширения через пробел]
//   - для удаления блока в терминале, будучи в корневой папке проекта, выполнить node cb.js [имя блока] rm

const fs = require('fs'); // будем работать с файловой системой
const mkdirp = require('mkdirp'); // зависимость, должна быть установлена (см. описание выше)
const rmdir = require('rmdir'); // зависимость, должна быть установлена (см. описание выше)

const PATHS = {
  src: `src`,
  components: `components`,
  scss: `assets/scss`,
  pug: `pug/templates`
};

const blockName = process.argv[2]; // получим имя блока
const defaultExtensions = [`pug`, `scss`, `js`]; // расширения по умолчанию
const extensions = uniqueArray(defaultExtensions.concat(process.argv.slice(3))); // добавим введенные при вызове расширения (если есть)

// Если есть имя блока
if (blockName) {

  if (process.argv[3] === `rm`) { // удаление
    removeBlock();
  } else { // создание
    createBlock();
  }

} else {
  console.log(`Отмена операции: не указан блок`);
}

// создание блока
function createBlock() {
  let dirPath = `${PATHS.src}/${PATHS.components}/${blockName}`; // полный путь к создаваемой папке блока
  mkdirp(`${dirPath}/`, function (err) { // создаем

    // Если какая-то ошибка — покажем
    if (err) {
      console.error(`Отмена операции: ${err}`);
    }

    // Нет ошибки, поехали!
    else {

      console.log(`Создание папки ${dirPath} (создана, если ещё не существует)`);

      mkdirp(`${dirPath}/img`);

      // Обходим массив расширений и создаем файлы, если они еще не созданы
      extensions.forEach(function (extention) {

        const filePath = `${dirPath}/${blockName}.${extention}`; // полный путь к создаваемому файлу
        const scssFilePath = `${dirPath}/_${blockName}.${extention}`; // полный путь к создаваемому файлу
        let fileContent = ``; // будущий контент файла
        let styleFileImport = ``; // будущая конструкция импорта файла стилей
        let templateFileImport = ``; // будущая конструкция импорта файла шаблонов

        // Если это SCSS
        if (extention === `scss`) {
          styleFileImport = `@import '../../${PATHS.components}/${blockName}/_${blockName}.scss';`;
          fileContent = `.${blockName} {\n  \n}\n`;

          fs.appendFile(`${PATHS.src}/${PATHS.scss}/main.scss`, `\n${styleFileImport}`, function (err) {
            if (err) {
              return console.log(`main.scss НЕ обновлён: ${err}`);
            }
            console.log(`main.scss обновлён`);
          });
        }

        // Если это PUG
        if (extention === `pug`) {
          templateFileImport = `include ../../${PATHS.components}/${blockName}/${blockName}.pug`;
          fileContent = `mixin ${blockName}(data)\n  .${blockName}&attributes(attributes)`;

          fs.appendFile(`${PATHS.src}/${PATHS.pug}/blocks.pug`, `\n${templateFileImport}`, function (err) {
            if (err) {
              return console.log(`blocks.pug НЕ обновлён: ${err}`);
            }
            console.log(`blocks.pug обновлён`);
          });
        }


        // Создаем файл, если он еще не существует
        if (fileExist(filePath) === false) {
          fs.writeFile(extention === `scss` ? scssFilePath : filePath, fileContent, function (err) {
            if (err) {
              return console.log(`Файл НЕ создан: ${err}`);
            }
            console.log(`Файл создан: ${filePath}`);
          });
        } else {
          console.log(`Файл НЕ создан: ${filePath} (уже существует)`);
        }

      });
    }
  });
}

// удаление блока
function removeBlock() {
  let blockDelName = `${PATHS.src}/${PATHS.components}/${blockName}`; // имя удаляемого блока
  let includeStrScss = `\n@import '../../${PATHS.components}/${blockName}/${blockName}';`; // строка удаления из scss
  let includeStrPug = `\ninclude ../../${PATHS.components}/${blockName}/${blockName}`; // строка удаления из pug
  fs.exists(blockDelName, function (exists) {
    if (exists) { // если каталог существует удаляем его
      rmdir(blockDelName, function (err, dirs, files) { //удаление каталога
        console.log(dirs);
        console.log(files);
        console.log(`все файлы удалены`);
      });
      // обновление style.scss
      fs.readFile(`${PATHS.src}/${PATHS.scss}/main.scss`, `utf8`, function (err, contents) { // читаем файл
        if (!err) {
          let fileText = contents.replace(new RegExp(includeStrScss, `g`), ``); // заменяем ненужную строку подключения
          fs.writeFile(`${PATHS.src}/${PATHS.scss}/main.scss`, fileText, function () { // переписываем файл
            console.log(`Файл main.scss обновлен`);
          });
        } else {
          console.log(`Ошибка обновления файлы "main.scss" ${err}`);
        }
      });
      // обновление blocks.pug
      fs.readFile(`${PATHS.src}/${PATHS.pug}/blocks.pug`, `utf8`, function (err, contents) { // читаем файл
        if (!err) {
          let fileText = contents.replace(new RegExp(includeStrPug, `g`), ``); // заменяем ненужную строку подключения
          fs.writeFile(`${PATHS.src}/${PATHS.pug}/blocks.pug`, fileText, function () { // переписываем файл
            console.log(`Файл block.pug обновлен`);
          });
        } else {
          console.log(`Ошибка обновления файлы "block.pug" ${err}`);
        }
      });
    } else {
      console.log(`Блок "${blockName}" не существует!`);
    }
  });

}

// Оставить в массиве только уникальные значения (убрать повторы)
function uniqueArray(arr) {
  let objectTemp = {};
  for (let i = 0; i < arr.length; i++) {
    let str = arr[i];
    objectTemp[str] = true; // запомнить строку в виде свойства объекта
  }
  return Object.keys(objectTemp);
}

// Проверка существования файла
function fileExist(path) {
  try {
    fs.statSync(path);
  } catch (err) {
    return !(err && err.code === `ENOENT`);
  }
}
