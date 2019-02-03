(function () {
    let select = document.querySelector('.add__type');
    let addBtn = document.querySelector('.add__btn');
    let addValue = document.querySelector('.add__value');
    let incomeList = document.querySelector('.income__list');
    let expenseList = document.querySelector('.expenses__list');
    let budgetIncome = document.querySelector('.budget__income--value');
    let budgetExpenses = document.querySelector('.budget__expenses--value');
    let budgetValue = document.querySelector('.budget__value');
    let description = document.querySelector('.add__description');
    let selectedOptions = select.selectedOptions;


    let storage = {
        todos: [],
        incomeArr: [],
        expenseArr: [],
        expenseArrNaN: []
    }

    function generateId() {
        const words = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
        let id = '';
        for (let char in words) {
            let index = Math.floor(Math.random() * words.length);
            id += words[index];
        }
        return id;
    }

    function markup(value, addDescriptionValue, item) {
        let valueTwoFix = value.toFixed(2);
        value > 999 ? value = valueTwoFix[0] + ',' + valueTwoFix.slice(1, valueTwoFix.length) : value = value.toFixed(2);

        let newTask = {
            description: addDescriptionValue,
            value,
            id: generateId()
        }
        storage.todos.push(newTask);

        return `
    <div class="item clearfix" data-id="${newTask.id}">
    <div class="item__description">${newTask.description}</div>
    <div class="right clearfix">
        <div class="item__value">${item}${newTask.value}</div>
        <div class="item__delete">
            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
        </div>
    </div>
</div>
     `
    }

    // Создаём событие на клик по элементу селект, можем выбирать доходы и расходы
    select.onclick = function () {
        if (select.value === 'expense') { // Выбираем расходы
            expense();
        } else if (select.value === 'income') { // Выбираем доходы
            income();
        }
    }

    if (select.value === 'income') { // Первый клик по кнопке доходы
        income();
    }
    // // Создаём функцию добавления в разделы доходов и расходов function income() и function expense()
    function income() {
        addBtn.onclick = function () {
            let valueStorage = document.querySelector('.add__type').value;
            for (var i = 0; i < selectedOptions.length; i++) {
                if (valueStorage === 'income') {
                    if (!description.value || !addValue.value) return alert("Нее, давай колись скок поднял и на чем");
                    storage.incomeArr.push(Number(addValue.value));

                    let addDescriptionValue = document.querySelector('.add__description').value;
                    let value = Number(addValue.value);
                    let incomeField = markup(value, addDescriptionValue, "+");
                    incomeList.insertAdjacentHTML('afterbegin', incomeField);
                    incomeArray();
                    readValue();
                    description.value = " "; //сброс значений с инпутов при нажатии 
                    addValue.value = null;
                }
            }
        };
    }

    function expense() {
        addBtn.onclick = function () {
            let valueStorage = document.querySelector('.add__type').value;
            for (var i = 0; i < selectedOptions.length; i++) {
                if (valueStorage === 'expense') {
                    if (!description.value || !addValue.value) return alert("Нее, давай колись скок потратил и на чем");
                    // Заполняем массив expenseArr
                    storage.expenseArr.push(Number(addValue.value));

                    let value = Number(addValue.value);
                    let addDescriptionValue = document.querySelector('.add__description').value;
                    let expenseField = markup(value, addDescriptionValue, "-");
                    expenseList.insertAdjacentHTML('afterbegin', expenseField);
                    expenseArray();
                    readValue();
                };
            }
        };
    }

    let contain = document.querySelector(".container")
    contain.addEventListener('click', function (e) {
        if (e.target.classList.contains('ion-ios-close-outline')) { //тоесть еще раз делегирование клацая на родитель этого элемента мы его отловили просто проверив содержит ли текущее нажатие такой то класс(в нашем случае клас удаления для кнопки)
            const id = e.target.closest('[data-id]').dataset.id;
            console.log(id);
            const target = document.querySelector(`[data-id="${id}"]`);
            target.parentElement.removeChild(target); // Удаление элемента
            let itemForArr = document.querySelectorAll('.item__value'); // Получаем значение
            let incArr = []; // Создаём пустой массив
            let expArr = [];
            for (let i = 0; i < itemForArr.length; i++) {
                if (itemForArr[i].closest('.income__list')) {
                    incArr[i] = Number(itemForArr[i].textContent);
                } else if (itemForArr[i].closest('.expenses__list')) {
                    expArr[i] = Number(itemForArr[i].textContent);
                }
            }
            storage.incomeArr = incArr; // Запись значений в массив в income
            storage.expenseArr = expArr; // Запись значений в массив в expense
            incomeArray();
            expenseArray();
            readValue();
        }
    });


    // Работаем с табло
    // Создадим функцию суммирования значений

    function incomeArray() {
        let sumIncome = 0;
        for (let i = 0; i < storage.incomeArr.length; i++) {
            sumIncome += storage.incomeArr[i];
        }
        console.log('Сумма массива income = ' + sumIncome);
        budgetIncome.innerHTML = sumIncome;
        return sumIncome;
    }

    function expenseArray() {
        let sumExpense = 0;
        for (i = 0; i < storage.expenseArr.length; i++) {
            sumExpense += storage.expenseArr[i];
            if (sumExpense) {
                budgetExpenses.innerHTML = sumExpense;
            } else if (!sumExpense) {
                let expChild = expenseList.children;
                let strArr = [];
                for (let i = 0; i < expChild.children; i++) {
                    strArr[i] = expChild.children[i].textContent.split(''); // Дочерние элементы родительского элемента expenses__list
                }
                let itemVal = document.querySelectorAll('.item__value'); // Получаем значение
                let incArr1 = [];
                for (let i = 0; i < itemVal.length; i++) {
                    if (itemVal[i].closest('.expenses__list')) {
                        incArr1[i] = Number(itemVal[i].textContent);
                    }
                }
                storage.expenseArrNaN = incArr1; // Запись в массив тех значений, при условии NaN
                let sumExpenseNaN1 = 0;
                for (let n = 0; n < storage.expenseArrNaN.length; n++) {
                    if (storage.expenseArrNaN[n] !== undefined) {
                        sumExpenseNaN1 += storage.expenseArrNaN[n];
                    }
                }
                // Необходимо получить класс для заполнения поля expense
                budgetExpenses.innerHTML = sumExpenseNaN1;
                sumExpense += storage.expenseArr[i];
            }
        }

        sumExpenseValue = sumExpense;
        // budgetExpenses.innerHTML = sumExpense;
        return sumExpenseValue;
    }
    expenseArray();

    function readValue() {
        if (storage.expenseArr.length === 0) {
            budgetExpenses.innerHTML = '0';
        }
        let readInc = Number(budgetIncome.textContent);
        let readExp = Number(budgetExpenses.textContent);
        console.log(readInc + ' readInc');

        // Если ReadExp отрицательная, то сделать её положительно
        if (readExp < 0) {
            readExp *= -1;
        }
        console.log(readExp + ' readExp');
        let result = readInc - readExp;
        budgetValue.innerHTML = result;
    }

    ////////////////////////фокус
    addValue.addEventListener("mouseover", funcFocus);
    description.addEventListener("mouseover", funcFocus1);
    addValue.addEventListener("mouseout", funcBlur);
    description.addEventListener("mouseout", funcBlur1);

    function funcFocus() {
        for (var i = 0; i < selectedOptions.length; i++) {
            if (selectedOptions[i].value == "expense") { //если  нажат такой то вставляем ипут и тег бр в конец
                addValue.style.border = '2px solid #B22222';
            } else if (selectedOptions[i].value == "income") {
                addValue.style.border = '2px solid #40cfff';
            }
        }
    }

    function funcFocus1() {
        for (var i = 0; i < selectedOptions.length; i++) {
            if (selectedOptions[i].value == "expense") { //если  нажат такой то вставляем ипут и тег бр в конец
                description.style.border = '2px solid #B22222';
            } else if (selectedOptions[i].value == "income") {
                description.style.border = '2px solid #40cfff';
            }
        }
    }

    function funcBlur() {
        for (var i = 0; i < selectedOptions.length; i++) {
            if (selectedOptions[i].value == "expense") { //если  нажат такой то вставляем ипут и тег бр в конец
                addValue.style.border = '';
                description.style.border = '';
            } else if (selectedOptions[i].value == "income") {
                addValue.style.border = '';
                description.style.border = '';
            }
        }
    }

    function funcBlur1() {
        for (var i = 0; i < selectedOptions.length; i++) {
            if (selectedOptions[i].value == "expense") { //если  нажат такой то вставляем ипут и тег бр в конец
                addValue.style.border = '';
                description.style.border = '';
            } else if (selectedOptions[i].value == "income") {

                addValue.style.border = '';
                description.style.border = '';
            }
        }
    }
}());