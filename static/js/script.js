document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const app = document.getElementById("app");
  const navLinks = document.querySelectorAll(".nav-link");
  const revealEls = document.querySelectorAll(".reveal");
  const yearEl = document.getElementById("year");
  const priceType = document.getElementById("price_type");
  const priceGroup = document.getElementById("price_group");

  // Footer year
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Show / hide price field
  function updatePriceVisibility() {
    if (!priceType || !priceGroup) return;
    if (priceType.value === "paid") {
      priceGroup.style.display = "block";
    } else {
      priceGroup.style.display = "none";
    }
  }
  updatePriceVisibility();
  if (priceType) {
    priceType.addEventListener("change", updatePriceVisibility);
  }

  // Loader
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.pointerEvents = "none";
      app.classList.remove("hidden");
      setTimeout(() => {
        loader.style.display = "none";
      }, 400);
    }, 800);
  });

  // Smooth scroll + nav active state + click animation
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      link.classList.add("click-animate");
      setTimeout(() => link.classList.remove("click-animate"), 200);
    });
  });

  // Scroll reveal using IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));

  // MCQ demo
  const mcqGrade = document.getElementById("mcq-grade");
  const mcqStart = document.getElementById("mcq-start");
  const mcqContainer = document.getElementById("mcq-container");
  const mcqResult = document.getElementById("mcq-result");

  async function loadMcq() {
    if (!mcqContainer || !mcqResult) return;
    mcqResult.textContent = "";
    mcqContainer.innerHTML = "<p>Loading questions...</p>";

    try {
      const grade = mcqGrade.value;
      const response = await fetch(`/mcq/${grade}/`);
      const data = await response.json();
      renderMcq(data);
    } catch (err) {
      mcqContainer.innerHTML = "<p>Failed to load questions. Try again.</p>";
      console.error(err);
    }
  }

  function renderMcq(data) {
    mcqContainer.innerHTML = "";
    const form = document.createElement("form");

    data.questions.forEach((q, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "mcq-question";

      const title = document.createElement("h4");
      title.textContent = `${index + 1}. ${q.question}`;
      wrapper.appendChild(title);

      const list = document.createElement("ul");
      list.className = "mcq-options";

      q.options.forEach((opt, i) => {
        const li = document.createElement("li");
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `q-${q.id}`;
        input.value = i;
        input.style.marginRight = "0.4rem";
        label.appendChild(input);
        label.appendChild(document.createTextNode(opt));
        li.appendChild(label);
        list.appendChild(li);
      });

      wrapper.appendChild(list);
      form.appendChild(wrapper);
    });

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = "Submit Test";
    submit.className = "btn primary-btn click-animate";
    form.appendChild(submit);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let score = 0;
      data.questions.forEach((q) => {
        const checked = form.querySelector(`input[name="q-${q.id}"]:checked`);
        if (checked && Number(checked.value) === q.answer) {
          score++;
        }
      });
      const percent = Math.round((score / data.questions.length) * 100);
      mcqResult.textContent = `You scored ${score}/${data.questions.length} (${percent}%).`;
    });

    mcqContainer.appendChild(form);
  }

  if (mcqStart) {
    mcqStart.addEventListener("click", loadMcq);
  }
});
