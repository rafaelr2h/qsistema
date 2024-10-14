 // Função para gerar os botões de avaliação
 function generateRatingButtons(containerId, name) {
    const container = document.getElementById(containerId);
    const ratings = Array.from({ length: 10 }, (_, i) => i + 1); // Gerar números de 1 a 10

    ratings.forEach(rating => {
        const input = document.createElement("input");
        input.type = "radio";
        input.className = "btn-check";
        input.name = name;
        input.id = `${name}${rating}`;
        input.value = rating;
        input.required = true;

        const label = document.createElement("label");
        label.className = "btn btn-outline-primary";
        label.htmlFor = `${name}${rating}`;
        label.textContent = rating;

        container.appendChild(input);
        container.appendChild(label);
    });
}

// Função para alternar a exibição do motivo quando "Não" for selecionado
function toggleReason(show) {
    const notSolvedReason = document.getElementById("notSolvedReason");
    const reasonField = document.getElementById("reason");
    if (show) {
        notSolvedReason.classList.remove("d-none");
        reasonField.setAttribute("required", "true");
    } else {
        notSolvedReason.classList.add("d-none");
        reasonField.removeAttribute("required");
    }
}

// Função para coletar os dados do formulário e enviar para o json-server
async function submitForm(event) {
    event.preventDefault();

    if (!event.target.checkValidity()) {
        event.target.reportValidity();
        return;
    }

    const solved = document.querySelector('input[name="solved"]:checked')?.value;
    const reason = document.getElementById("reason").value;
    const serviceRating = document.querySelector('input[name="serviceRating"]:checked')?.value;
    const deliveryRating = document.querySelector('input[name="deliveryRating"]:checked')?.value;

    const data = {
        solved,
        reason: solved === "nao" ? reason : null, // Só envia o motivo se a resposta for "Não"
        serviceRating,
        deliveryRating
    };

    try {
        const response = await fetch("http://localhost:3000/avaliacoes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Avaliação enviada com sucesso!");
            event.target.reset(); // Limpa todos os campos do formulário
            toggleReason(false); // Esconde o campo de motivo, caso esteja visível
        } else {
            alert("Falha ao enviar avaliação. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro ao enviar os dados:", error);
        alert("Erro ao enviar a avaliação. Tente novamente.");
    }
}


// Gerar os botões de avaliação ao carregar a página
document.addEventListener("DOMContentLoaded", function() {
    generateRatingButtons("serviceRatingContainer", "serviceRating");
    generateRatingButtons("deliveryRatingContainer", "deliveryRating");
    document.getElementById("evaluationForm").addEventListener("submit", submitForm);
});
