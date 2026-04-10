const STORAGE_KEY = "percent_calc_v1_history";

$(document).ready(function () {

    function calculate() {
        let p = parseFloat($("#percent").val());
        let v = parseFloat($("#value").val());
        let r = parseFloat($("#result").val());

        let filled = [!isNaN(p), !isNaN(v), !isNaN(r)].filter(x => x).length;

        if (filled < 2) {
            alert("Enter any 2 values ❗");
            return;
        }

        let computed = null;

        if (isNaN(p)) {
            p = (r / v) * 100;
            $("#percent").val(p.toFixed(2));
            highlight("#percent");
            computed = "p";
        } else if (isNaN(v)) {
            v = r / (p / 100);
            $("#value").val(v.toFixed(2));
            highlight("#value");
            computed = "v";
        } else if (isNaN(r)) {
            r = (p / 100) * v;
            $("#result").val(r.toFixed(2));
            highlight("#result");
            computed = "r";
        }

        saveHistory(p, v, r, computed);
    }
    
    function highlight(id) {
        $(id).addClass("result-highlight");
        setTimeout(() => $(id).removeClass("result-highlight"), 800);
    }

    function saveHistory(p, v, r, computed) {
        let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

        let entry = { p, v, r, computed };
        history.unshift(entry);
        history = history.slice(0, 10);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        $("#historyList").empty();

        history.forEach((item, index) => {

            let p = item.computed === "p"
                ? `<span class="computed">${item.p}</span>`
                : item.p;

            let v = item.computed === "v"
                ? `<span class="computed">${item.v}</span>`
                : item.v;

            let r = item.computed === "r"
                ? `<span class="computed">${item.r}</span>`
                : item.r;

            $("#historyList").append(`
        <div class="history-item">
          <span class="history-text" data-index="${index}">
            ${p}% of ${v} = ${r}
          </span>
          <i class="bi bi-x-circle delete-btn" data-index="${index}"></i>
        </div>
      `);
        });
    }

    // Click to reuse
    $(document).on("click", ".history-text", function () {
        let index = $(this).data("index");
        let history = JSON.parse(localStorage.getItem(STORAGE_KEY));

        let item = history[index];
        $("#percent").val(item.p);
        $("#value").val(item.v);
        $("#result").val(item.r);
    });

    // Delete one
    $(document).on("click", ".delete-btn", function () {
        let index = $(this).data("index");
        let history = JSON.parse(localStorage.getItem(STORAGE_KEY));

        history.splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        renderHistory();
    });

    // Clear all
    $("#clearHistory").click(function () {
        if (confirm("Delete all history?")) {
            localStorage.removeItem(STORAGE_KEY);
            renderHistory();
        }
    });

    // Reset inputs
    $("#reset").click(function () {
        $("#percent, #value, #result").val("");
    });

    $("#solve").click(calculate);

    renderHistory();

});