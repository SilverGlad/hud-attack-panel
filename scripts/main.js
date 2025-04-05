Hooks.on("ready", () => {
    // Adiciona o painel HTML no body
    fetch("modules/hud-attack-panel/templates/panel.html")
      .then(r => r.text())
      .then(html => {
        $('body').append(html);
      });
  
    // Fecha o HUD
    $(document).on("click", "#hud-close", () => {
      $("#action-hud").addClass("hidden");
      $("#hud-buttons").html("");
    });
  
    // Intercepta clique em itens na ficha
    Hooks.on("renderActorSheet", (app, html, data) => {
      html.find('.item[data-type="weapon"]').on("click", async (event) => {
        event.preventDefault();
        const li = event.currentTarget;
        const itemId = li.dataset.itemId;
        const actor = app.actor;
        const item = actor.items.get(itemId);
  
        if (!item || item.type !== "weapon") return;
  
        // Cria os botões da HUD com base nas ações disponíveis
        const buttons = await item.getChatData();
        const div = $("#hud-buttons");
        div.html(""); // limpa antes
  
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
  
        if (item.hasSave) {
          const saveBtn = $(`<button>Rolagem de Salvamento</button>`);
          saveBtn.on("click", () => item.rollSave());
          div.append(saveBtn);
        }
  
        $("#action-hud").removeClass("hidden");
      });
    });
  });
  