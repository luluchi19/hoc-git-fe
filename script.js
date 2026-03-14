const showAlert = (content = null, time = 3000, type = "alert--success") => {
    if(content){
        const newAlert = document.createElement("div");
        newAlert.setAttribute("class", `alert ${type}`);

        newAlert.innerHTML = `
            <span class="alert__content">${content}</span>
            <span class="alert__close">
                <i class="fa-solid fa-xmark"></i>
            </span>
        `;
        const alertList = document.querySelector(".alert-list");

        alertList.appendChild(newAlert);

        const alertClose = document.querySelector(".alert__close");

        alertClose.addEventListener("click", () => {
            alertList.removeChild(newAlert);
        })

        setTimeout(() => {
            alertList.removeChild(newAlert);
        }, time);
    }
}

const eventButtonDelete = () =>{
    const listButtonDelete = document.querySelectorAll("[button-delete]");
    listButtonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("button-delete");

            Swal.fire({
                title: "Bạn có chắc muốn xóa?",
                text: "Hành động này sẽ không thể khôi phục lại!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Vẫn xóa!",
                cancelButtonText: "Không xóa"
              }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`http://localhost:3000/books/${id}`)
                        .then(res => {
                            const trDelete = document.querySelector(`tr[item-id="${id}"]`);
                            if(trDelete){
                                trDelete.remove();
                            }
                            Swal.fire({
                                title: "Đã xóa!",
                                text: "Sách này đã bị xóa khỏi danh sách",
                                icon: "success",
                                timer: 3000
                              });
                        })
                }
              });
        });
    })
}
