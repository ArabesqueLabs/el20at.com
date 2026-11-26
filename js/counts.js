// 20at archive: a count with its noun as Arabic counts it, for the pages' scripts (the same rule and forms as
// arabic-counts.json, which the templates and the pipeline read; tests/test_pipeline.py checks they agree).
// arCount(11, "article") -> "١١ مقالًا"; 1 and 2 have no digit: "مقال واحد", "مقالان"; 3–10 "مقالات";
// 11–99 "مقالًا"; 0, 100, 101, 102, 200… "مقال" (by the last two digits).
(() => {
  const FORMS = {
    article: { one: "مقال واحد", sing: "مقال", two: "مقالان", few: "مقالات", many: "مقالًا" },
    article_restored: { one: "مقال واحد استعدناه", sing: "مقال استعدناه", two: "مقالان استعدناهما", few: "مقالات استعدناها", many: "مقالًا استعدناه" },
    comment: { one: "تعليق واحد", sing: "تعليق", two: "تعليقان", few: "تعليقات", many: "تعليقًا" },
    name: { one: "اسم واحد", sing: "اسم", two: "اسمان", few: "أسماء", many: "اسمًا" },
    reader: { one: "قارئ أو قارئة", sing: "قارئ وقارئة", two: "قارئان", few: "قرّاء وقارئات", many: "قارئًا وقارئة" },
  };
  const AR = "٠١٢٣٤٥٦٧٨٩";
  const digits = (n) => Number(n).toLocaleString("en-US").replace(/\d/g, (d) => AR[d]).replace(/,/g, "٬");
  window.arCount = (n, noun) => {
    const f = FORMS[noun], r = n % 100;
    if (n === 1) return f.one;
    if (n === 2) return f.two;
    return `${digits(n)} ${r >= 3 && r <= 10 ? f.few : r >= 11 ? f.many : f.sing}`;
  };
  window.arCountForms = FORMS;
})();
