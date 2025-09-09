<script>
  fetch('structure.json')
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#structureTable tbody");
      data.forEach(struct => {
        const row = `
          <tr>
            <td>${struct.name}</td>
            <td>${struct.faction}</td>
            <td>${struct.location}</td>
            <td>${struct.dropRate}</td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    });
</script>