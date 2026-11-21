/* =========================================================
   data.js — все карточки шпаргалки
   Категория: { id, emoji, title, sub, items: [{ t, d, code, os? }] }
   os — необязательный массив: ["macOS"], ["Linux"], ["Windows"].
   Если os не указан, карточка считается универсальной.
   ========================================================= */

const r = String.raw; // сохраняет обратные слэши в коде (регэкспы, \n)

window.CATEGORIES = [

/* ============================ БЫСТРЫЙ СТАРТ ============================ */
{
  id: "start",
  emoji: "🚀",
  title: "Быстрый старт",
  sub: "окружение, venv, запуск скрипта",
  items: [
    {
      t: "Запуск Python в терминале",
      d: "macOS: ⌘Space → Terminal · Linux: Ctrl+Alt+T · Windows: PowerShell или Windows Terminal. Команды ниже работают везде, где установлен Python 3.",
      code: r`python3 --version            # macOS / Linux
py --version                 # Windows: Python Launcher
python3 -c "print(2 ** 10)"  # однострочный скрипт
python3 script.py            # запустить файл
python -i script.py          # файл + интерактив после
# macOS: open .   |   Linux: xdg-open .
# Windows: explorer .`,
    },
    {
      t: "Виртуальное окружение (venv)",
      d: "У каждого проекта — свой pip и пакеты. Активация: macOS/Linux — source .venv/bin/activate, Windows CMD — .venv\\Scripts\\activate.bat, PowerShell — .venv\\Scripts\\Activate.ps1.",
      code: r`cd ~/Projects/myapp            # macOS / Linux
cd %USERPROFILE%\Projects\myapp  # Windows CMD
python3 -m venv .venv          # macOS / Linux
py -m venv .venv               # Windows
source .venv/bin/activate      # macOS / Linux
.venv\Scripts\activate.bat     # Windows CMD
python -m pip install requests # ставить сюда
pip list                       # что установлено
deactivate                     # выключить
rmdir /s /q .venv              # удалить (Windows)
rm -rf .venv                   # удалить (macOS / Linux)`,
    },
    {
      t: "pip — установка пакетов",
      d: "Для CLI-утилит удобнее pipx: brew install pipx (macOS), winget install pipx.pipx (Windows), apt/pipx в Linux. Системный Python не трогаем: пакеты ставим в venv.",
      code: r`pip install requests
pip install "flask>=3.0,<4"
pip install -U pip
pip install -r requirements.txt
pip freeze > requirements.txt
pip show flask
pip uninstall flask`,
    },
    {
      t: "uv — быстрый менеджер пакетов",
      d: "Замена pip/venv, написанная на Rust: работает в 10–100 раз быстрее.",
      code: r`brew install uv                                    # macOS
winget install astral-sh.uv                         # Windows
curl -LsSf https://astral.sh/uv/install.sh | sh     # Linux
uv venv                                             # создать .venv
source .venv/bin/activate                           # macOS / Linux
.venv\Scripts\activate.bat                          # Windows CMD
uv pip install requests
uvx ruff check .                                    # CLI без установки`,
    },
    {
      t: "uv как менеджер проекта",
      d: "Альтернатива Poetry: зависимости в pyproject.toml, lock-файл по умолчанию.",
      code: r`uv init myapp
cd myapp
uv add requests
uv remove requests
uv run main.py
uv sync                       # поставить всё из uv.lock`,
    },
    {
      t: "Poetry — классический менеджер проектов",
      d: "Управляет зависимостями, окружениями и публикацией пакета.",
      code: r`brew install poetry                       # macOS
winget install PythonSoftwareFoundation.Poetry  # Windows
# Linux: curl -sSL https://install.python-poetry.org | python3 -
poetry new myapp
poetry add requests
poetry run python main.py
poetry env use python3.12`,
    },
    {
      t: "Свой исполняемый скрипт (shebang)",
      d: "В macOS/Linux shebang позволяет запускать ./script.py. В Windows работает py script.py или ассоциация .py; shebang учитывается в WSL/Git Bash.",
      code: r`#!/usr/bin/env python3
# первая строка файла (только для macOS / Linux)

import sys

print("Привет!")
print(sys.executable)         # какой интерпретатор используется

# macOS / Linux:  chmod +x script.py && ./script.py
# Windows:        py script.py`,
    },
    {
      t: "Скрипт двойным щелчком: .command / .bat",
      d: "Полезно для быстрого запуска без терминала. Примеры ниже для macOS/Linux и Windows.",
      os: ["macOS", "Linux", "Windows"],
      code: r`# macOS / Linux: script.sh или run.command
chmod +x run.command
./run.command

# содержимое run.command:
#!/bin/zsh
cd "$(dirname "$0")"
source .venv/bin/activate
python3 main.py

# Windows: run.bat
@echo off
cd /d "%~dp0"
call .venv\Scripts\activate.bat
py main.py
pause`,
    },
  ],
},

/* ====================== PYTHON В ТЕРМИНАЛЕ ====================== */
{
  id: "cli",
  emoji: "🖥",
  title: "Python в терминале",
  sub: "флаги, REPL, pydoc, -m модули",
  items: [
    {
      t: "Полезные флаги python3",
      d: "Флаги интерпретатора, которые стоит держать под рукой.",
      code: r`python3 -u script.py    # вывод без буферизации
python3 -i script.py    # интерактивная сессия после падения
python3 -O script.py    # пропустить assert (прод-режим)
python3 -q               # тихий REPL без баннера
python3 -W error         # предупреждения превращаются в исключения
python3 --help           # все флаги`,
    },
    {
      t: "REPL — шпаргалка",
      d: "Режим python3 без аргументов. Tab — автодополнение, Ctrl+D — выход.",
      code: r`>>> help(len)          # справка по функции
>>> dir(str)           # все методы строки
>>> len(dir(str))
77
>>> _                  # последний выведенный результат
77
>>> quit()
# pip install ipython — продвинутый REPL`,
    },
    {
      t: "pydoc — документация без интернета",
      d: "Встроенная справка открывается в терминале или в браузере.",
      code: r`python3 -m pydoc json            # справка по модулю
python3 -m pydoc json.dumps      # по функции
python3 -m pydoc -k csv          # поиск по ключевому слову
python3 -m pydoc -b              # открыть доки в браузере`,
    },
    {
      t: "Модули-скрипты: python -m …",
      d: "Готовые утилиты, которые идут в комплекте с Python и запускаются через -m.",
      code: r`python3 -m http.server 8000      # веб-сервер текущей папки
python3 -m json.tool data.json   # красивый JSON
python3 -m timeit "sum(range(100))"   # скорость выражения
python3 -m zipfile -e arch.zip out/   # распаковать архив
python3 -m py_compile script.py   # проверить на синтаксис
python3 -m calendar               # календарь года`,
    },
    {
      t: "Упаковка: zipapp",
      d: "Быстрый способ раздать скрипт одним файлом-архивом.",
      code: r`python3 -m zipapp mytool/ -m "main:main" -o mytool.pyz
python3 mytool.pyz      # запускается как обычный скрипт

python3 -m py_compile script.py    # только проверка на ошибки`,
    },
    {
      t: "Отладка падений в терминале",
      d: "Просмотр стека при падении и вход в отладчик.",
      code: r`python3 -X faulthandler script.py    # печать стека при крушении
python3 -m pdb script.py             # отладчик
python3 -m pdb -c continue script.py # сразу до первой ошибки

breakpoint()          # вход в pdb внутри кода`,
    },
  ],
},

/* ==================== ПЕРЕМЕННЫЕ И ТИПЫ ==================== */
{
  id: "types",
  emoji: "📦",
  title: "Переменные и типы",
  sub: "int · float · str · bool · None",
  items: [
    {
      t: "Переменные и базовые типы",
      d: "Присвоение «имя = значение». Аннотация через двоеточие ничего не проверяет, пишет только читаемость.",
      code: r`name = "Python"       # str    строка
version = 3.12        # float  дробное
major = 3             # int    целое
running = True        # bool   True / False
owner = None          # None   «нет значения»
rate: float = 0.25    # присвоение с аннотацией
big = 5_000_000       # разделитель для читаемости — это 5000000`,
    },
    {
      t: "Приведение типов",
      d: "Функции int(), float(), str(), bool() и конструкторы коллекций строят значения одного типа из другого.",
      code: r`int("42")          # 42
int(3.99)          # 3   отбрасывает дробь, а не округляет
float("3.14")      # 3.14
str(42)            # '42'
bool(0), bool("")  # (False, False)
list("abc")        # ['a', 'b', 'c']
set([1, 1, 2])     # {1, 2}  дубликаты ушли
tuple([1, 2])      # (1, 2)
dict(price=1, tag="cpu")  # {'price': 1, 'tag': 'cpu'}`,
    },
    {
      t: "Проверка типа",
      d: "type() возвращает класс значения; isinstance() даёт логический ответ и учитывает наследование.",
      code: r`type(3.14)                       # <class 'float'>
isinstance(True, int)            # True — bool наследуется от int!
isinstance("text", str)
isinstance(3.14, (int, float))   # один из типов
x = None
x is None                        # «пустота» проверяется через is`,
    },
    {
      t: "Числа и операторы",
      d: "int не переполняется; деление / всегда даёт float.",
      code: r`7 / 2        # 3.5    обычное деление
7 // 2       # 3      деление нацело
7 % 2        # 1      остаток (чётность: n % 2 == 0)
2 ** 10      # 1024   степень
divmod(7, 2) # (3, 1) частное и остаток разом
round(2.675, 2)  # 2.67  банковское округление
0b1010       # 10  двоичное
0o722        # 466 восьмеричное
0x1F         # 31  шестнадцатеричное
abs(-5), max(1, 2), min(1, 2), pow(2, 3)`,
    },
    {
      t: "None, истина и ложь, is vs ==",
      d: "«Ложные» значения: 0, 0.0, '' и пустые коллекции [], {}, set(), () и None. Всё остальное — истина.",
      code: r`running = True
items = []
if not items:            # короче, чем len(items) == 0
    print("пусто")

x is None                # «пустота» — через is, не == None
a == b                   # сравнение по значению
a is b                   # тот же объект в памяти
True and False           # False
True or False            # True
not running              # False`,
    },
    {
      t: "Распаковка и обмен значениями",
      d: "Кортежи и списки можно разложить сразу в несколько переменных.",
      code: r`a, b = 1, 2
a, b = b, a                # обмен местами
first, *rest = [1, 2, 3]   # first=1, rest=[2, 3]
*init, last = [1, 2, 3]    # init=[1, 2], last=3
(x, y) = (10, 20)          # явная распаковка кортежа
point = 10, 20             # скобки необязательны — это кортеж`,
    },
  ],
},

/* ========================= СТРОКИ ========================= */
{
  id: "strings",
  emoji: "🔤",
  title: "Строки",
  sub: "f-строки, методы, срезы",
  items: [
    {
      t: "Создание и склейка строк",
      d: "Кавычки ' или \" равнозначны. + соединяет, * повторяет, join — правильный способ для списка.",
      code: r`s = "hello"
s2 = "world"
line = " ".join([s, s2])             # 'hello world'
word = "ha" * 3                      # 'hahaha'
mixed = s + " " + s2                 # конкатенация плюсом
shout = f"{s.upper()} {s2.title()}"  # 'HELLO World'

# escapes: \n перенос строки, \t табуляция, \" кавычка, \\ слэш`,
    },
    {
      t: "f-строки",
      d: "Python 3.6+. Строка с префиксом f подставляет значения переменных и выражений.",
      code: r`name, price = "coffee", 249.5
f"Привет, {name}!"             # Привет, coffee!
f"{name=} {price=}"            # name='coffee' price=249.5
f"{price:.2f} ₽"               # 249.50 ₽
f"{1234567:,}"                 # 1,234,567
f"{name.upper()}"              # внутри — любое выражение`,
},
    {
      t: "Методы строк",
      d: "Все методы возвращают новую строку — исходник не меняется.",
      code: r`s = "Hello World"
s.strip()             # убрать края (пробелы, табы)
s.lower(); s.upper(); s.title()
s.replace("l", "L")
s.startswith("He")    # True
s.endswith("ld")      # True
"ell" in s            # True
s.find("World")       # 6  индекс, -1 если нет
s.split()             # ['Hello', 'World']
"a;b;c".split(";")    # по разделителю
"-".join(["a", "b"])  # 'a-b'
s.count("l")          # сколько раз
"42".zfill(5)         # '00042'`,
    },
    {
      t: "Срезы строк s[a:b]",
      d: "Индексы с нуля, отрицательные — с конца. Формат [старт:стоп:шаг], стоп не включается.",
      code: r`s = "Python"
s[0]        # 'm'
s[-1]       # 'S'
s[2:5]      # 'cOS'
s[:3]       # 'mac'
s[::-1]     # 'SOcam'  перевёрнутая
s[::2]      # 'mCS'  каждый второй символ
len(s)      # 5
s.rstrip("OS")   # 'mac'`,
    },
    {
      t: "Сырые и многострочные строки",
      d: "r перед кавычкой отменяет спец-символы — путь или регэксп записываются дословно.",
      code: r`path = r"C:\Users\User\notes"  # без \n и \\
regex = r"\d{3}-\d{6}"

text = """многострочный
текст в тройных кавычках —
переносы и "кавычки" внутри"""`
    },
    {
      t: "Форматирование и выравнивание",
      d: "Спецификатор после двоеточия: заполнитель/выравнивание/ширина/точность/тип.",
      code: r`f"{3.14159:.2f}"    # '3.14'    точность
f"{0.2561:.1%}"     # '25.6%'   проценты
f"{12345:,}"        # '12,345'  разделитель тысяч
f"{'hi':>10}"       # '        hi'  по правому краю
f"{'hi':<10}"       # 'hi        '  по левому
f"{'hi':^10}"       # '    hi    '  по центру
f"{'hi':*^10}"      # '****hi****'  заполнитель
f"{255:x}"          # 'ff'  hex; b — binary; o — octal
"{0} и {1}".format(1, 2)   # старый стиль str.format`,
    }
  ]
},

/* ========================= КОЛЛЕКЦИИ ========================= */
{
  id: "collections",
  emoji: "🗃",
  title: "Коллекции",
  sub: "list · tuple · dict · set",
  items: [
    {
      t: "Список (list) — методы",
      d: "Изменяемая последовательность в []. Методы меняют список на месте, большинство возвращает None.",
      code: r`nums = [1, 2, 3]
nums.append(4)        # в конец
nums.extend([5, 6])   # добавить элементы другого списка
nums.insert(0, 9)     # по индексу
nums.remove(2)        # по значению
nums.pop()            # вынуть последний
nums.pop(0)           # вынуть по индексу
nums.reverse()        # перевернуть на месте
nums.sort()           # отсортировать на месте
nums.index(4)         # индекс значения
nums.count(4)         # сколько раз
nums.clear()          # очистить`,
    },
    {
      t: "Список — срезы, поиск, сортировка",
      d: "Срез возвращает новый список; sorted() тоже новый; key задаёт правило сортировки.",
      code: r`nums = [5, 2, 8, 1]
words = ["cat", "hippo", "ox"]
users = [{"age": 30}, {"age": 20}]

nums[1:3]            # [2, 8]
nums[::-1]           # реверс — новый список
len(nums)            # 4
8 in nums            # True
min(nums), max(nums), sum(nums)
sorted(nums)                  # новый отсортированный
sorted(nums, reverse=True)
sorted(users, key=lambda u: u["age"])
sorted(words, key=len)        # по длине строк`,
    },
    {
      t: "Кортеж (tuple)",
      d: "Как list, но неизменяем; можно как ключ словаря. Одноэлементный требует запятую.",
      code: r`point = (10, 20)
x, y = point
single = (42,)       # запятая обязательна!
tuple([1, 2])
nums, letters = (1, 2), ("a", "b")
combined = point + (30,)   # конкатенация — новый кортеж
point[0]             # 10`,
    },
    {
      t: "Словарь (dict) — методы",
      d: "Пары «ключ → значение». С 3.7 сохраняет порядок вставки; с 3.9 — merge через |.",
      code: r`user = {"name": "Mac", "age": 30}
user["name"]                 # KeyError если нет
user.get("city", "<нет>")    # без ошибки
user["city"] = "Moscow"      # добавить/заменить
del user["age"]              # удалить по ключу
user.pop("city")             # удалить и вернуть
"name" in user               # есть ли ключ
user.keys()                  # все ключи
user.values()                # все значения
user.items()                 # пары (k, v)
user.update({"w": 1})
merged = user | {"a": 1}     # новый словарь (3.9+)`,
    },
    {
      t: "Множество (set)",
      d: "Без дубликатов, неупорядочено. Быстрые проверки in и операции множеств.",
      code: r`s = {1, 2, 3}
empty = set()       # НЕ set{} — это пустой dict!
s.add(4)
s.discard(9)        # удалить, если есть
s.remove(9)         # KeyError если нет
1 in s
s2 = {2, 3, 5}
s | s2              # объединение
s & s2              # пересечение
s - s2              # разница
s ^ s2              # xor (или то, или то)`,
    },
    {
      t: "Копии: поверхностная и глубокая",
      d: "a = b — это ссылка на тот же объект. Копируй, чтобы не менять оригинал случайно.",
      code: r`import copy
a = [[1, 2], [3, 4]]
b = copy.copy(a)      # поверхностная — вложенные общие
c = copy.deepcopy(a)  # глубокая — всё отдельно
d = a[:]              # ещё один способ (copy для списка)`,
    },
    {
      t: "Comprehensions",
      d: "Компактное создание list/dict/set из последовательности, с условием — но не превратим это в спагетти.",
      code: r`nums = [3, 7, 2, 9, 5, 1]
words = ["Hi", "OS"]
nested = [[1, 2], [3, 4]]

squares = [x * x for x in range(10)]
bigger = [x for x in nums if x > 5]
mods = [x % 3 for x in range(10)]
d = {k: v for k, v in [("a", 1), ("b", 2)]}
uniq = {w.lower() for w in words}
flat = [x for sub in nested for x in sub]   # вложенный for`,
    },
    {
      t: "collections: Counter, defaultdict, namedtuple, deque",
      d: "Полезные обёртки стандартной библиотеки — для частых операций.",
      code: r`from collections import Counter, defaultdict, namedtuple, deque

c = Counter(["a", "b", "a"])     # Counter({'a': 2, 'b': 1})
Counter({"a": 2, "b": 1}).most_common(1)

d = defaultdict(list)            # ключа нет → []
d["tags"].append("py")

Point = namedtuple("Point", ["x", "y"])
p = Point(1, 2)
p.x

q = deque(maxlen=3)              # ограниченная очередь
q.append(1)
q.popleft()`,
    }
  ]
},

/* ====================== УСЛОВИЯ И ЦИКЛЫ ====================== */
{
  id: "control",
  emoji: "🔀",
  title: "Условия и циклы",
  sub: "if · match · for · while",
  items: [
    {
      t: "if / elif / else",
      d: "Блок — это отступ (4 пробела). elif = сокращение else if.",
      code: r`temp = 21
if temp > 25:
    print("жарко")
elif temp > 15:
    print("тепло")          # выполнится эта ветка
else:
    print("холодно")`,
    },
    {
      t: "match / case (3.10+)",
      d: "Мощнее switch: матчит значения, кортежи, списки и даже распаковывает элементы.",
      code: r`command = "start 3000"
match command.split():
    case ["start"]:
        print("старт без порта")
    case ["start", port]:
        print("старт на порту", port)
    case ["stop"] | ["kill"] as what:
        print("остановка:", what)
    case _:
        print("не знаю такой команды")`,
    },
    {
      t: "for + range / enumerate / zip",
      d: "for перебирает любой iterable: список, строку, dict, генератор.",
      code: r`for i in range(5):               # 0..4
    print(i)
for i in range(0, 101, 10):      # 0, 10, ..., 100
    print(i)
for idx, val in enumerate(items, start=1):
    print(idx, val)
for name, age in zip(names, ages):
    print(name, age)
total = sum(x * x for x in nums) # для вычислений — часто короче`,
    },
    {
      t: "while + break / continue",
      d: "while крутится, пока условие истинно. break — выйти из цикла, continue — следующая итерация.",
      code: r`count = 0
while True:
    count += 1
    if count == 3:
        continue              # шаг 3 пропускаем
    if count > 10:
        break                 # выйти из цикла
    print(count)`,
    },
    {
      t: "Тернарный оператор и «морж» (:=)",
      d: "Однострочный if/else и присвоение внутри условия (Python 3.8+, оператор :=).",
      code: r`errors = 0
status = "ok" if errors == 0 else "есть ошибки"
a, b = 3, 7
x = a if a > b else b            # максимум из двух

items = [1] * 11
if (n := len(items)) > 10:
    print("много", n)

import sys
# sys.exit(1)    # немедленный выход со статус-кодом`,
    },
    {
      t: "else у цикла и pass",
      d: "else у for/while выполняется, если break не сработал: удобно для задачи «нашли или нет».",
      code: r`items = [{"id": 2}]
target = 1
for item in items:
    if item["id"] == target:
        print("нашли", item)
        break
else:
    print("не нашли")

def todo():          # заглушка, пока не написано
    pass`,
    }
  ]
},

/* ========================= ФУНКЦИИ ========================= */
{
  id: "functions",
  emoji: "🧩",
  title: "Функции",
  sub: "def · *args/**kwargs · декораторы",
  items: [
    {
      t: "Функция: def и return",
      d: "Имена → snake_case. return выдаёт результат и завершает работу; без return — None.",
      code: r`def greet(name, greeting="Привет"):
    """Объединяет приветствие и имя (это докстринг)."""
    return f"{greeting}, {name}!"

greet("Mac")                          # по позиции
greet(name="Mac", greeting="Hello")   # по имени`
    },
    {
      t: "Аргументы: default, *args, **kwargs",
      d: "*args собирает лишние позиционные аргументы в tuple, **kwargs — именованные в dict.",
      code: r`def log(msg, *args, level="info", **kwargs):
    print(msg, args, kwargs)

log("старт", 12, level="info", at=3)

# разжать при вызове:
point = (10, 20)
# move(*point)          # move(10, 20)
opts = {"mode": "w", "size": 2}
open("a.txt", **opts)     # open("a.txt", mode="w")`,
},
    {
      t: "Positional-only и keyword-only (3.8+)",
      d: "Слева от / — только позиционные, справа от * — только именованные.",
      code: r`def make(name, /, *, timeout=5): ...
make("host", timeout=10)   # ок
# make(name="host")        # ошибка: name позиционный-только`,
},
    {
      t: "lambda и key=",
      d: "Анонимная функция в одну строку. Чаще всего — как key при сортировке.",
      code: r`nums = [1, 2, 3, 4]
users = [{"name": "Mac", "age": 30}]
double = lambda x: x * 2
sorted(users, key=lambda u: u["age"])    # список словарей
max(users, key=lambda u: u["age"])
min(["a", "bb"], key=len)
evens = list(filter(lambda x: x % 2 == 0, nums))`,
},
    {
      t: "Замыкание и nonlocal",
      d: "Вложенная функция запоминает переменные внешней; для присвоения — nonlocal.",
      code: r`def make_counter():
    count = 0
    def inc():
        nonlocal count    # иначе count — локальная
        count += 1
        return count
    return inc

c = make_counter()
c()  # 1
c()  # 2`,
},
    {
      t: "Декоратор — простой",
      d: "Функция, которая принимает функцию и возвращает обёртку. Синтаксис с @ — сахар.",
      code: r`def loud(func):
    def wrapper(*args, **kwargs):
        print(f"→ вызов {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@loud
def add(a, b):
    return a + b

add(1, 2)   # сначала напечатает «→ вызов add»`,
},
    {
      t: "Декоратор с functools.wraps",
      d: "wraps сохраняет имя и докстринг оригинала; без него обёртка теряет эти атрибуты.",
      code: r`import functools, time

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        out = func(*args, **kwargs)
        print(f"{func.__name__}: {time.perf_counter() - t0:.4f} s")
        return out
    return wrapper

@timer
def slow():
    time.sleep(0.2)

slow()`,
},
  ]
},

/* ========================== ООП ========================== */
{
  id: "oop",
  emoji: "🏛",
  title: "ООП и классы",
  sub: "классы · наследование · dataclass",
  items: [
    {
      t: "Класс: __init__ и self",
      d: "self — сам экземпляр, ставится первым параметром. Поля класса вне __init__ — общие для всех.",
      code: r`class Dog:
    kind = "млекопитающее"     # атрибут класса — общий
    def __init__(self, name, age):
        self.name = name       # атрибут экземпляра
        self.age = age
    def bark(self):
        return f"{self.name}: гав!"

dog = Dog("Rex", 3)
dog.bark()
Dog.kind        # общий атрибут`,
},
    {
      t: "Наследование и super()",
      d: "Родитель в скобках. super().__init__ запускает родительский конструктор.",
      code: r`class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    def bark(self):
        return f"{self.name}: гав"

class Puppy(Dog):
    def __init__(self, name, age, breed):
        super().__init__(name, age)
        self.breed = breed
    def bark(self):
        parent = super().bark()
        return f"пи! (и {parent})"

dog = Puppy("Bim", 1, "sheltie")
dog.bark()`,
},
    {
      t: "Dunder-методы",
      d: "Магические методы делают класс полноценным Питоновским типом — print, ==, in, len, with.",
      code: r`class Box:
    items = []
    def __str__(self):    return "текст для print()"
    def __repr__(self):   return "Box(items=[])"
    def __eq__(self, other): return self.items == other.items
    def __hash__(self):   return hash(len(self.items))
    def __len__(self):    return len(self.items)
    def __getitem__(self, i): return self.items[i]
    def __contains__(self, x): return x in self.items
    def __iter__(self):   yield from self.items
    def __call__(self):   ...  # объект можно вызывать: box()
    def __enter__(self):  return self
    def __exit__(self, *exc): ...  # пара к with`,
},
    {
      t: "@property и setter",
      d: "Свойство выглядит как поле, а работает как метод — можно вставить проверку при записи.",
      code: r`class Slot:
    def __init__(self):
        self._n = 0
    @property
    def n(self):
        return self._n
    @n.setter
    def n(self, v):
        if v < 0:
            raise ValueError("n < 0")
        self._n = v

slot = Slot()
slot.n = 5
slot.n            # 5 — как поле`,
},
    {
      t: "@classmethod и @staticmethod",
      d: "classmethod получает cls — удобно как «второй конструктор»; staticmethod — просто функция внутри класса.",
      code: r`class Date:
    @classmethod
    def from_string(cls, text):
        return cls.from_iso(text)

    @staticmethod
    def is_leap(year):
        return year % 4 == 0     # без self

Date.is_leap(2026)`,
},
    {
      t: "dataclass — класс без шаблона",
      d: "Из полей-аннотаций генерируются __init__, __repr__, __eq__; frozen=True — immutable/hashable.",
      code: r`from dataclasses import dataclass, field

@dataclass
class User:
    name: str
    tags: list[str] = field(default_factory=list)
    id: int = 0

u = User("Mac")
u.tags.append("py")
u
User(name='Mac', tags=['py'], id=0)`,
},
    {
      t: "Enum и абстрактный класс (ABC)",
      d: "Enum — строгие константы; ABC — базовый класс, требующий реализацию метода.",
      code: r`from enum import Enum, auto
class Env(Enum):
    DEV = auto()
    PROD = "prod"
Env.DEV.name     # "DEV"
Env.DEV.value
Env["DEV"]       # по имени

from abc import ABC, abstractmethod
class Base(ABC):
    @abstractmethod
    def run(self): ...
# Base() — нельзя; и наследник без run() — тоже ошибка`,
},
  ]
},

/* ======================= ИСКЛЮЧЕНИЯ ======================= */
{
  id: "errors",
  emoji: "💥",
  title: "Исключения",
  sub: "try · except · raise",
  items: [
    {
      t: "try / except / else / finally",
      d: "Обязательны только try и except; else — если не было ошибки; finally выполнится всегда.",
      code: r`try:
    value = int(input("число: "))
except ValueError as e:
    print("не число:", e)
else:
    print("ок, работаем дальше")   # не было ошибки
finally:
    print("финализация — всегда")  # cleanup`,
},
    {
      t: "raise и свои исключения",
      d: "raise бросает исключение. Для своей ошибки — класс-наследник Exception.",
      code: r`raise ValueError("плохое значение")       # встроенное

class AppConfigError(Exception):
    """своя ошибка приложения"""

def load(config):
    if "debug" not in config:
        raise AppConfigError("нет ключа 'debug'")`
    },
    {
      t: "raise … from — цепочка причин",
      d: "from сохраняет первоначальную ошибку как «причину» — удобно при пробросе наверх.",
      code: r`try:
    import yaml
except ImportError as e:
    raise RuntimeError("не найден yaml") from e

raise RuntimeError("данные не получены") from None`
    },
    {
      t: "assert и предупреждения",
      d: "assert снимается с python -O. Для «нарушен контракт» — исключение AssertionError.",
      code: r`assert [1, 2] == [1, 2], "данные потерялись"
import warnings
warnings.warn("устаревший API", DeprecationWarning)

import logging
log = logging.getLogger(__name__)
try:
    risky()
except Exception:
    log.exception("что-то пошло не так")   # стек в лог`
    },
  ]
},

/* ============== ИТЕРАТОРЫ И ГЕНЕРАТОРЫ ============== */
{
  id: "iters",
  emoji: "♻️",
  title: "Итераторы и генераторы",
  sub: "yield · itertools · functools",
  items: [
    {
      t: "Генератор: yield",
      d: "Функция с yield отдаёт значения по одному и помнит состояние между вызовами.",
      code: r`def countdown(n):
    while n > 0:
        yield n
        n -= 1

for x in countdown(5):
    print(x)            # 5, 4, 3, 2, 1

gen = countdown(3)
next(gen)               # 3
list(gen)               # [2, 1]

def read_lines(path):   # по одной строке, без нагрузки в памяти
    with open(path) as f:
        for line in f:
            yield line.rstrip()`
    },
    {
      t: "Генераторные выражения",
      d: "Как comprehension, но лениво — вычисляется при переборе. (...) вместо [...].",
      code: r`squares = (x * x for x in range(10_000_000))
sum(x * x for x in range(100))
total = sum(len(s) for s in ["ab", "c"])
pairs = [("a", 1), ("b", 2)]
next(pair for pair in pairs if pair[0] == "a")`
    },
    {
      t: "itertools",
      d: "Готовые блоки для обычной и параллельной обработки последовательностей.",
      code: r`import itertools
from itertools import chain, product, combinations, \
    permutations, islice, count, pairwise, accumulate

list(chain([1, 2], [3]))               # [1, 2, 3]
list(product("AB", "CD"))              # декартово произведение
list(combinations("ABC", 2))           # сочетания по две
list(permutations("ABC"))              # перестановки
list(islice(count(), 5))               # [0, 1, 2, 3, 4]
list(pairwise([1, 2, 3]))              # [(1, 2), (2, 3)] (3.10+)
list(accumulate([1, 2, 3]))            # [1, 3, 6]
first, second = itertools.tee([1, 2], 2)`
    },
    {
      t: "functools: reduce, partial, lru_cache",
      d: "Готовые обёртки для повторных вычислений и не только.",
      code: r`import functools

functools.reduce(lambda a, b: a * b, [1, 2, 3, 4], 1)  # 24
square = functools.partial(pow, 2)   # pow(2, x)
square(10)                           # 1024

@functools.lru_cache(maxsize=128)
def add(a, b):
    return a + b

add(1, 2)
add.cache_info()`
    },
  ]
},

/* ====================== ФАЙЛЫ И ПУТИ ====================== */
{
  id: "files",
  emoji: "📂",
  title: "Файлы и пути",
  sub: "open · pathlib · json · csv",
  items: [
    {
      t: "Чтение и запись: open()",
      d: "Режимы: r чтение, w запись (затирает), a добавление, x новый; b — в байтах; encoding — обязательно для текста.",
      code: r`with open("data.txt", encoding="utf-8") as f:
    data = f.read()            # файл целиком (для мелких)
    # f.readlines()            # список строк
    # for line in f: ...       # лучше для больших файлов

with open("out.txt", "w", encoding="utf-8") as f:
    f.write("Hello\n")
    print("через print", file=f)

with open("data.bin", "wb") as f:
    f.write(b"\x00\x01")`,
    },
    {
      t: "pathlib.Path",
      d: "Объектно-ориентированный путь — удобнее и надёжнее, чем os.path.",
      code: r`from pathlib import Path

p = Path("data") / "sub" / "file.txt"   # склеивание
p.name, p.stem, p.suffix, p.parent      # части пути
p.resolve()                              # абсолютный путь
p.exists(); p.is_file(); p.is_dir()
p.mkdir(parents=True, exist_ok=True)
list(Path(".").glob("*.py"))
list(Path(".").rglob("*.json"))          # рекурсивно
text = p.read_text(encoding="utf-8")
p.write_text("hello", encoding="utf-8")`,
    },
    {
      t: "JSON",
      d: "Стандартный формат данных для конфигов и API.",
      code: r`import json

data = {"name": "mac", "tags": ["py"]}
text = json.dumps(data, ensure_ascii=False, indent=2)
parsed = json.loads(text)

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open("data.json", encoding="utf-8") as f:
    same = json.load(f)`,
    },
    {
      t: "CSV",
      d: "Диалог с таблицами: чтение по строкам или в словарь по заголовкам.",
      code: r`import csv

with open("data.csv", newline="", encoding="utf-8") as f:
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        print(row)
    # или csv.DictReader(f) — имена полей из заголовков

with open("out.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["col1", "col2"])
    writer.writerows([[1, "a"], [2, "b"]])`,
    },
    {
      t: "shutil и tempfile",
      d: "Копирование, перемещение, удаление папок; временные файлы и каталоги.",
      code: r`import shutil, tempfile
from pathlib import Path

shutil.copy("a.txt", "b.txt")
shutil.copytree("src", "dst")
shutil.move("src", "dst")
shutil.rmtree("junk")             # удалить папку целиком

with tempfile.TemporaryDirectory() as tmp:
    print(tmp)                    # удалится на выходе

with tempfile.NamedTemporaryFile("w", suffix=".py") as tf:
    tf.write("print('hi')")

Path("a.txt").stat().st_size      # размер файла`,
    },
  ],
},

/* ==================== АННОТАЦИИ ТИПОВ ==================== */
{
  id: "typing",
  emoji: "🏷",
  title: "Аннотации типов",
  sub: "typing · Optional · Protocol",
  items: [
    {
      t: "Базовые аннотации",
      d: "Аннотации не проверяются во время работы — их читают инструменты: mypy, pyright, IDE.",
      code: r`name: str = "mac"

def power(base: int, exponent: int) -> int:
    return base ** exponent`,
    },
    {
      t: "int | None (PEP 604)",
      d: "С 3.10 необязательный тип — вертикальная черта вместо Optional.",
      code: r`prices: dict[str, int] = {"mac": 30, "air": 120}

def find(key: str) -> int | None:
    return prices.get(key)

def process(items: list[str] | None) -> list[str]:
    if items is None:
        return []
    return items`,
    },
    {
      t: "Callable, TypedDict, Protocol, Literal",
      d: "Описания «форма функции», «словарь по схеме», «есть метод» и строгий набор значений.",
      code: r`from typing import Callable, Literal, Protocol, TypedDict

def run(fn: Callable[[int], str], x: int) -> str:
    return fn(x)

class User(TypedDict):
    name: str
    age: int

class HasArea(Protocol):
    def area(self) -> float: ...    # «утиный» интерфейс

Mode = Literal["fast", "safe"]`,
    },
    {
      t: "TypeVar, Generic, Final",
      d: "Обобщённые функции и классы, константа объявления.",
      code: r`from typing import Final, Generic, TypeVar

T = TypeVar("T")

def first(items: list[T]) -> T: ...

class Box(Generic[T]):
    def __init__(self, item: T) -> None:
        self.item = item

MAX: Final = 10
points: list[T] = []`,
    },
    {
      t: "Проверка: mypy и pyright",
      d: "Аннотации захватывают своего персонажа через статический анализатор.",
      code: r`python3 -m pip install mypy
mypy script.py
mypy src/ --strict
uvx pyright script.py`,
    },
  ],
},

/* ====================== АСИНХРОННОСТЬ ====================== */
{
  id: "async",
  emoji: "⚡",
  title: "Асинхронность",
  sub: "async / await · asyncio",
  items: [
    {
      t: "async / await — минимальный скрипт",
      d: "Корутина стартует через asyncio.run в главном потоке; await — точка ожидания.",
      code: r`import asyncio

async def hello() -> None:
    await asyncio.sleep(1)
    print("после таймаута")

asyncio.run(hello())`,
    },
    {
      t: "Параллельные задачи: gather",
      d: "gather ждёт список корутин и собирает результаты в том же порядке.",
      code: r`import asyncio

async def fetch(kind: str) -> str:
    await asyncio.sleep(1)
    return kind

async def main() -> None:
    results = await asyncio.gather(fetch("a"), fetch("b"))
    print(results)

asyncio.run(main())`,
    },
    {
      t: "TaskGroup и timeout (3.11+)",
      d: "Структурный запуск задач: при падении одной отменяются остальные.",
      code: r`async def main() -> None:
    async with asyncio.TaskGroup() as tg:
        t1 = tg.create_task(fetch("a"))
        t2 = tg.create_task(fetch("b"))
    print(t1.result(), t2.result())

    async with asyncio.timeout(5):
        await fetch("heavy")`,
    },
    {
      t: "Queue, Lock, Semaphore, Event",
      d: "Примитивы обмена и ограничения параллелизма.",
      code: r`import asyncio

q = asyncio.Queue(maxsize=10)
lock = asyncio.Lock()      # защита общего ресурса
sem = asyncio.Semaphore(5) # не более 5 одновременно
event = asyncio.Event()

async def worker(q: asyncio.Queue) -> None:
    while True:
        item = await q.get()
        q.task_done()

async def limited(sem: asyncio.Semaphore) -> None:
    async with sem:
        await asyncio.sleep(1)`,
    },
    {
      t: "aiohttp — HTTP поверх async",
      d: "Сторонний пакет, стандарт для асинхронных запросов.",
      code: r`# uv add aiohttp    (или pip install aiohttp)
import aiohttp

async def fetch_json(url: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return await resp.json()`,
    },
  ],
},

/* ================= СТАНДАРТНАЯ БИБЛИОТЕКА ================= */
{
  id: "stdlib",
  emoji: "🧰",
  title: "Стандартная библиотека",
  sub: "os · re · datetime · logging …",
  items: [
    {
      t: "os и sys",
      d: "Переменные окружения, файловая система, аргументы командной строки.",
      code: r`import os, sys

os.environ.get("HOME")         # переменная окружения
os.environ["PY_CHEAT"] = "1"   # на текущую сессию
os.getcwd()
os.makedirs("a/b", exist_ok=True)
os.listdir(".")
os.remove("tmp.txt")
os.rename("a.txt", "b.txt")

sys.argv            # аргументы командной строки
sys.path            # где ищутся модули
sys.exit(1)         # код выхода`,
    },
    {
      t: "re — регулярные выражения",
      d: "Поиск, замена, разбор строк по шаблону. Всегда пишите r перед кавычкой.",
      code: r`import re
text = "id: 42, name: Mac"

m = re.search(r"id: (\d+)", text)
m.group(1)                     # '42'
re.findall(r"\d+", text)       # ['42']
re.sub(r"\s+", "_", text)      # пробелы → подчёркивания

pattern = re.compile(r"name: (\w+)")
pattern.search(text).group(1)  # 'Mac'`,
    },
    {
      t: "datetime",
      d: "Дата и время: текущие значения, разница, форматирование.",
      code: r`from datetime import datetime, timedelta, timezone

now = datetime.now(timezone.utc)
yesterday = now - timedelta(days=1)
d = datetime.fromisoformat("2026-10-24T12:00:00")

d.year, d.month, d.day
d.strftime("%d.%m.%Y")         # '24.10.2026'
(d - yesterday).days           # разница в днях`,
    },
    {
      t: "logging вместо print",
      d: "Уровни DEBUG → INFO → WARNING → ERROR → CRITICAL.",
      code: r`import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
log = logging.getLogger(__name__)

log.debug("значение: %s", 42)
log.info("запущено")
log.warning("возможно, устарело")
log.error("ошибка: %s", "boom")
log.exception("полный стек")   # внутри except`,
    },
    {
      t: "subprocess — внешние команды",
      d: "Списком аргументов безопаснее, чем строкой; capture_output собирает вывод.",
      code: r`import subprocess

r = subprocess.run(
    ["ls", "-la"], capture_output=True, text=True, check=True,
)
print(r.stdout)
subprocess.run(["git", "status"], check=True)
subprocess.run("ls | grep .py | wc -l", shell=True)

pid = subprocess.Popen(["tail", "-f", "app.log"])
pid.kill()`,
    },
    {
      t: "argparse — CLI-интерфейс",
      d: "Cтандартный парсер флагов: описание, дефолты, проверка значений.",
      code: r`import argparse

parser = argparse.ArgumentParser(prog="mytool")
parser.add_argument("path", help="файл или папка")
parser.add_argument("--verbose", "-v", action="store_true")
parser.add_argument("--level", "-l", type=int, default=1)
parser.add_argument("--mode", choices=["fast", "safe"])
args = parser.parse_args()     # args.path, args.verbose, ...
print(args)`,
    },
    {
      t: "random, statistics, secrets",
      d: "Случайные значения; для паролей и токенов — secrets, не random.",
      code: r`import random, secrets, statistics

nums = [1, 2, 3, 4, 5]
random.choice(nums)
random.sample(nums, 3)
random.shuffle(nums)
random.random(), random.randint(1, 6)

statistics.mean(nums)
statistics.median(nums)
statistics.stdev(nums)

secrets.token_hex(16)          # пароль/токен`,
    },
    {
      t: "hashlib, uuid, base64",
      d: "Хэши, идентификаторы, бинарное кодирование.",
      code: r`import base64, hashlib, uuid

hashlib.sha256(b"data").hexdigest()
uuid.uuid4()
uuid.uuid4().hex
base64.b64encode(b"data")`,
    },
    {
      t: "sqlite3 — база в файле",
      d: "Встроенная SQL-база, ничего ставить не надо: идеальна для утилит и прототипов.",
      code: r`import sqlite3

db = sqlite3.connect("app.db")
db.execute(
    "CREATE TABLE IF NOT EXISTS users ("
    "id INTEGER PRIMARY KEY, name TEXT, age INTEGER)"
)
db.execute("INSERT INTO users (name, age) VALUES (?, ?)",
           ("Mac", 30))
db.commit()

for row in db.execute("SELECT id, name FROM users"):
    print(row)

db.row_factory = sqlite3.Row   # row["name"], row["age"]`,
    },
    {
      t: "http.server и urllib",
      d: "Микро-HTTP без зависимостей: сервер отвечает, клиент ходит.",
      code: r`from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"hello from python!")
    def log_message(self, *args): ...

# ThreadingHTTPServer(("localhost", 8000), Handler).serve_forever()

from urllib import request
with request.urlopen("https://example.com") as r:
    r.status
    html = r.read().decode()`,
    },
  ],
},

/* ==================== ТЕСТЫ И ОТЛАДКА ==================== */
{
  id: "testing",
  emoji: "🧪",
  title: "Тесты и отладка",
  sub: "pytest · unittest · pdb · профилирование",
  items: [
    {
      t: "pytest — команды",
      d: "Тесты пишутся в файлах test_*.py, функции называются test_*.",
      code: r`python3 -m pip install pytest
pytest                      # все тесты
pytest test_math.py -v      # один файл с подробностями
pytest -k "run"             # по имени теста
pytest --maxfail=1 -x       # остановка на первом провале
pytest --lf                 # продолжить с последнего провала`,
    },
    {
      t: "pytest: фикстуры и параметризация",
      d: "Фикстура подставляется к тесту именованным аргументом — так готовится окружение.",
      code: r`import pytest

@pytest.fixture
def db(tmp_path):
    return []

@pytest.mark.parametrize("x, expected", [
    (1, 2), (10, 20), (-5, -10),
])
def test_double(x, expected):
    assert x * 2 == expected

def test_with_db(db):
    db.append(1)
    assert db == [1]`,
    },
    {
      t: "unittest",
      d: "Без зависимостей, входит в стандартную поставку.",
      code: r`import unittest

class TestMath(unittest.TestCase):
    def test_add(self):
        self.assertEqual(1 + 1, 2)
        self.assertIn("a", "abc")

if __name__ == "__main__":
    unittest.main()

# или так: python3 -m unittest discover`,
    },
    {
      t: "breakpoint() и pdb",
      d: "Один вызов останавливает исполнение и открывает отладчик.",
      code: r`breakpoint()                 # останов на этой строке

import pdb; pdb.set_trace()  # старый стиль

# команды pdb: l — код, n — шаг, s — внутрь,
# c — продолжить, p x — переменная, q — выйти`,
    },
    {
      t: "Профилирование: timeit, cProfile",
      d: "Узнать, что тормозит, прежде чем оптимизировать.",
      code: r`# python3 -m timeit "sum(range(100))"
# python3 -m cProfile -s cumulative script.py

import cProfile
from time import perf_counter

cProfile.run("sum(range(100))")

t0 = perf_counter()
sum(range(100))
print(perf_counter() - t0)`,
    },
  ],
},

/* ==================== ПОЛЕЗНЫЕ СНИППЕТЫ ==================== */
{
  id: "snippets",
  emoji: "✂️",
  title: "Полезные сниппеты",
  sub: "паттерны, которые почти всем нужны",
  items: [
    {
      t: "Таймер-декоратор",
      d: "Время выполнения любой функции.",
      code: r`import functools, time

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        result = func(*args, **kwargs)
        dt = time.perf_counter() - t0
        print(f"{func.__name__}: {dt:.4f} сек")
        return result
    return wrapper

@timer
def heavy():
    time.sleep(0.1)`,
    },
    {
      t: "Retry с экспоненциальной паузой",
      d: "Повторить при ошибке с нарастающей задержкой, максимум N раз.",
      code: r`import functools, random, time

def retry(times=3, base=0.5, factor=2):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for i in range(times):
                try:
                    return func(*args, **kwargs)
                except (ConnectionError, TimeoutError):
                    if i == times - 1:
                        raise
                    delay = base * (factor ** i) + random.random() * 0.1
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(times=3, base=0.5)
def flaky():
    ...`,
    },
    {
      t: "batched — обработка порциями",
      d: "Разбивает любую последовательность на куски по size.",
      code: r`import itertools

def batched(items, size):
    """Разбивает итерируемую последовательность по size штук."""
    it = iter(items)
    while True:
        chunk = tuple(itertools.islice(it, size))
        if not chunk:
            break
        yield chunk

for part in batched(range(10), 3):
    print(part)`,
    },
    {
      t: "lru_cache — кеш дорогих функций",
      d: "Однострочный декоратор для повторных вычислений.",
      code: r`import functools

@functools.lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

fib(30)     # мгновенно; fib.cache_info() покажет статистику`,
    },
    {
      t: "Массовое переименование файлов",
      d: "Пример: переделать img1.png → IMG-01.png по шаблону.",
      code: r`from pathlib import Path

for i, f in enumerate(Path(".").glob("img*.png"), start=1):
    f.rename(f.with_name(f"IMG-{i:02}.png"))

# расширение: f.with_suffix(".jpg")
# имя без суффикса: f.stem`,
    },
    {
      t: "Пароль и токены (secrets)",
      d: "Криптостойкий генератор из стандартной библиотеки.",
      code: r`import secrets, string

alphabet = string.ascii_letters + string.digits
password = "".join(secrets.choice(alphabet) for _ in range(14))

secrets.token_urlsafe(16)   # токен для ссылок
secrets.randbits(64)        # случайное число`,
    },
  ],
},

/* ============== КРОСС-ПЛАТФОРМЕННОСТЬ ============== */
{
  id: "crossplatform",
  emoji: "🌍",
  title: "Кросс-платформенно",
  sub: "один код для macOS · Linux · Windows",
  items: [
    {
      t: "Определить ОС из Python",
      d: "platform.system() и sys.platform — базовый способ подстроить поведение под систему.",
      code: r`import platform, sys

print(platform.system())   # 'Darwin' | 'Linux' | 'Windows'
print(sys.platform)        # 'darwin' | 'linux' | 'win32'
print(platform.machine())  # 'x86_64' | 'arm64' | 'AMD64'

sep = "\\" if sys.platform == "win32" else "/"
print("разделитель:", sep)`,
    },
    {
      t: "Активация venv на всех ОС",
      d: "Один и тот же .venv активируется по-разному. После активации везде работают команды python и pip.",
      code: r`# macOS / Linux (bash, zsh)
source .venv/bin/activate

# Windows CMD
.venv\Scripts\activate.bat

# Windows PowerShell
.venv\Scripts\Activate.ps1
# если ругается политика: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

# выключить окружение — одинаково везде
deactivate`,
    },
    {
      t: "Пути без '/' и '\\': pathlib",
      d: "Path из pathlib собирает путь «под текущую ОС». as_posix() нужен для URL и конфигов.",
      code: r`from pathlib import Path, PurePath

data = Path.home() / "projects" / "app" / "data.txt"
print(data)                        # /Users/... или C:\Users\...
print(PurePath("a", "b", "c.txt"))  # a/b/c.txt или a\b\c.txt
print(data.as_posix())             # всегда прямой слэш
data.parent.mkdir(parents=True, exist_ok=True)
print(data.name, data.stem, data.suffix)`,
    },
    {
      t: "Переменные окружения",
      d: "В Python — os.environ. В терминале синтаксис отличается: export, setx или $env:.",
      code: r`import os

token = os.environ.get("API_TOKEN", "")   # без KeyError
os.environ["DEBUG"] = "1"                 # только в этом процессе
print(os.getenv("HOME") or os.getenv("USERPROFILE"))

# macOS / Linux:  export API_TOKEN=abc
# Windows CMD:    setx API_TOKEN abc
# PowerShell:     $env:API_TOKEN = "abc"`,
    },
    {
      t: "Буфер обмена: pyperclip",
      d: "Один API для macOS, Linux и Windows. Ставится в venv: python -m pip install pyperclip.",
      code: r`# python -m pip install pyperclip
import pyperclip

pyperclip.copy("Кроссплатформенный текст")
print(pyperclip.paste())

# без зависимостей — встроенный tkinter
import tkinter as tk
root = tk.Tk()
root.withdraw()
root.clipboard_clear()
root.clipboard_append("ещё один вариант")
root.update()`,
    },
    {
      t: "Открыть файл или сайт системной программой",
      d: "webbrowser.open работает везде. Для файлов: open — macOS, xdg-open — Linux, os.startfile — Windows.",
      code: r`import os, platform, subprocess, webbrowser

webbrowser.open("https://python.org")     # браузер по умолчанию

def show(path):
    system = platform.system()
    if system == "Darwin":
        subprocess.run(["open", path], check=False)
    elif system == "Linux":
        subprocess.run(["xdg-open", path], check=False)
    else:
        os.startfile(path)                # только Windows

show("report.pdf")`,
    },
    {
      t: "Уведомления без привязки к ОС",
      d: "Пакет plyer даёт один вызов для десктопных уведомлений на трёх системах.",
      code: r`# python -m pip install plyer
from plyer import notification

notification.notify(
    title="Python",
    message="Задача выполнена",
    timeout=5,
)

# macOS без пакета:
# subprocess.run(["osascript", "-e",
#   'display notification "Готово" with title "Python"'])`,
    },
    {
      t: "Внешние команды кроссплатформенно",
      d: "subprocess со списком аргументов и sys.executable одинаково работает на всех ОС. shell=True — только при крайней нужде.",
      code: r`import subprocess, sys

subprocess.run([sys.executable, "--version"], check=True)
result = subprocess.run(
    [sys.executable, "-c", "print('ok')"],
    capture_output=True, text=True, check=True,
)
print(result.stdout.strip())   # ok

# danger: subprocess.run("ls | grep py", shell=True)`,
    },
    {
      t: "Кодировка и переводы строк",
      d: "Явно указывайте encoding=\"utf-8\" и newline=\"\" — CSV и тексты одинаково читаются на Windows, macOS и Linux.",
      code: r`from pathlib import Path

Path("note.txt").write_text("Привет\nМир", encoding="utf-8")
text = Path("note.txt").read_text(encoding="utf-8")
print(text)

import csv
with open("data.csv", "w", newline="", encoding="utf-8") as f:
    csv.writer(f).writerow(["/a", "b"])

# Windows сохраняет CRLF, macOS/Linux — LF; Python приведёт к \n`,
    },
  ]
},

/* =============== СИСТЕМЫ И ИНТЕГРАЦИЯ =============== */
{
  id: "macos",
  emoji: "🖥",
  title: "Системы и интеграция",
  sub: "системные вызовы: macOS · Linux · Windows",
  items: [
    {
      t: "pbcopy / pbpaste — буфер macOS",
      d: "Быстрая работа с clipboard через системные команды.",
      os: ["macOS"],
      code: r`import subprocess

subprocess.run(["pbcopy"], input="скопировано!".encode())

text = subprocess.run(
    ["pbpaste"], capture_output=True, text=True
).stdout
print(text)`,
    },
    {
      t: "wl-copy / xclip — буфер Linux",
      d: "Wayland — wl-copy/wl-paste, X11 — xclip/xsel. Зависимости ставятся менеджером пакетов.",
      os: ["Linux"],
      code: r`# sudo apt install wl-clipboard   (Wayland)
# sudo apt install xclip           (X11)
import subprocess

subprocess.run(["wl-copy"], input="текст".encode())
text = subprocess.run(["wl-paste"], capture_output=True, text=True).stdout
print(text)

# X11: subprocess.run(["xclip", "-selection", "clipboard"], input=b"текст")`,
    },
    {
      t: "clip.exe и PowerShell — буфер Windows",
      d: "Классический clip.exe из CMD или PowerShell-командлет Set-Clipboard/Get-Clipboard.",
      os: ["Windows"],
      code: r`import subprocess

subprocess.run(["clip"], input="текст".encode("utf-16le"))

text = subprocess.run(
    ["powershell", "-NoProfile", "-Command", "Get-Clipboard"],
    capture_output=True, text=True,
).stdout
print(text)

# PowerShell: "текст" | Set-Clipboard`,
    },
    {
      t: "open — Finder и приложения macOS",
      d: "То же, что двойной щелчок; -R показывает файл в Finder.",
      os: ["macOS"],
      code: r`import subprocess

subprocess.run(["open", "report.pdf"])
subprocess.run(["open", "."])
subprocess.run(["open", "-R", "report.pdf"])
subprocess.run(["open", "-a", "Terminal", "."])
subprocess.run(["open", "https://example.com"])`,
    },
    {
      t: "xdg-open — открыть файл в Linux",
      d: "Универсальный вызов «открыть как двойным щелчком» в большинстве дистрибутивов.",
      os: ["Linux"],
      code: r`import subprocess

subprocess.run(["xdg-open", "report.pdf"], check=False)
subprocess.run(["xdg-open", "."], check=False)
subprocess.run(["xdg-open", "https://python.org"], check=False)`,
    },
    {
      t: "explorer / start — открыть в Windows",
      d: "Проводник и ассоциации файлов из CMD или PowerShell.",
      os: ["Windows"],
      code: r`import os, subprocess

subprocess.run(["explorer", "report.pdf"], check=False)
subprocess.run(["explorer", "."], check=False)
subprocess.run(["start", "", "https://python.org"], shell=True, check=False)

# PowerShell: Start-Process report.pdf`,
    },
    {
      t: "Уведомления, say и beep macOS",
      d: "Скрипт сообщает о завершении через встроенные возможности macOS.",
      os: ["macOS"],
      code: r`import subprocess

msg = 'display notification "Готово!" with title "Python"'
subprocess.run(["osascript", "-e", msg])

subprocess.run(["say", "все готово"])
subprocess.run(["osascript", "-e", "beep"])`,
    },
    {
      t: "notify-send — уведомления Linux",
      d: "Работает в большинстве графических окружений через libnotify.",
      os: ["Linux"],
      code: r`# sudo apt install libnotify-bin
import subprocess

subprocess.run(
    ["notify-send", "Python", "Задача выполнена", "-t", "5000"],
    check=False,
)`,
    },
    {
      t: "Tkinter — минимальный GUI",
      d: "Tkinter входит в поставку python.org на всех ОС; в Linux и Homebrew может понадобиться отдельный пакет python-tk.",
      os: ["macOS", "Linux", "Windows"],
      code: r`import tkinter as tk
from tkinter import ttk

root = tk.Tk()
root.title("Python app")
root.geometry("300x200+200+200")

ttk.Label(root, text="Привет!").pack(padx=20, pady=10)
ttk.Button(root, text="OK", command=root.destroy).pack()
root.mainloop()`,
    },
    {
      t: "PyInstaller — скрипт → .app / .exe",
      d: "Собирает автономное приложение без установленного Python: .app на macOS, .exe на Windows, исполняемый файл в Linux.",
      os: ["macOS", "Linux", "Windows"],
      code: r`python -m pip install pyinstaller
pyinstaller --onefile --name="MyApp" main.py

# macOS: --windowed --icon=icon.icns
# Windows: --windowed --icon=icon.ico
# результат: папка dist/ и файл MyApp.spec`,
    },
    {
      t: "pyautogui — автоматизация кликов",
      d: "Клики, нажатия и скриншоты на всех ОС. macOS требует разрешений в «Защита и безопасность», Linux — X11/Wayland-зависимостей.",
      os: ["macOS", "Linux", "Windows"],
      code: r`# uv add pyautogui    (или pip install pyautogui)
import pyautogui

pyautogui.size()
pyautogui.click(x=100, y=200)
pyautogui.typewrite("hello", interval=0.1)
pyautogui.screenshot("shot.png")`,
    },
  ],
}
];
