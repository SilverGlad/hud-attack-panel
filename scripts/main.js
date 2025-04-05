Hooks.on("ready", () => {
  console.log("✅ Módulo HUD carregado");

  fetch("modules/hud-attack-panel/templates/panel.html")
    .then(r => r.text())
    .then(html => {
      $('body').append(html);
      console.log("✅ HUD HTML injetado");
    });

  $(document).on("click", "#hud-close", () => {
    $("#action-hud").addClass("hidden");
    $("#hud-buttons").html("");
  });

  Hooks.on("renderActorSheet", (app, html, data) => {
    console.log("🎭 Ficha carregada:", app.actor.name);

    // Exibe todos os itens com classe .item
    html.find('.item').each((i, el) => {
      const itemName = $(el).find('.item-name').text().trim();
      console.log("🔍 Item encontrado:", itemName);
    });

    html.find('.item').on("click", async (event) => {
      const li = event.currentTarget;
      const itemId = li.dataset.itemId;
      const actor = app.actor;
      const item = actor.items.get(itemId);

      console.log("🖱️ Item clicado:", item?.name);

      if (!item || item.type !== "weapon") {
        console.warn("❌ Item não é uma arma ou não foi encontrado.");
        return;
      }

      const div = $("#hud-buttons");
      div.html(""); // limpa

      $("#hud-item-name").text(item.name);

      if (item.hasAttack) {
        const atkBtn = $(`<button>Atacar</button>`);
        atkBtn.on("click", () => item.rollAttack());
        div.append(atkBtn);
      }

      if (item.hasDamage) {
        const dmgBtn = $(`<button>Dano</button>`);
        dmgBtn.on("click", () => item.rollDamage());
        div.append(dmgBtn);
      }

      $("#action-hud").removeClass("hidden");
    });
  });
});
