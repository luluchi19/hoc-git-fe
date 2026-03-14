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

const drawBookList = (keyword) => {
    let q = "";
    if(keyword) {
      q = `q=${keyword}`;
    }
    let linkApi = `http://localhost:3000/books?${q}`;
    axios.get(linkApi)
      .then(res => {
        let htmls = "";
  
        for (const item of res.data) {
          htmls += `
            <tr item-id="${item.id}">
              <td>${item.title}</td>
              <td>${item.price.toLocaleString()}đ</td>
              <td>${item.author}</td>
              <td>
                <a href="edit.html?id=${item.id}" class="button button-edit">Sửa</a>
                <button class="button button-delete" button-delete="${item.id}">Xóa</button>
              </td>
            </tr>
          `;
        }
        
        bookList.innerHTML = htmls;
        eventButtonDelete();
      })
  }

const bookList = document.querySelector(".book-list");
if(bookList){
    drawBookList();
}

const formSearch = document.querySelector(".form-search");
if(formSearch){
    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();
        const keyword = formSearch.keyword.value;

        drawBookList(keyword);
    });
}

const formCreate = document.querySelector("#form-create");
if(formCreate){
    formCreate.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = formCreate.title.value;
        const price = formCreate.price.value;
        const author = formCreate.author.value;

        if(!title){
            showAlert("Vui lòng nhập tiêu đề!", 3000, "alert--error");
            return;
        }

        if(!price){
            showAlert("Vui lòng nhập giá của cuốn sách!", 3000, "alert--error");
            return;
        }

        if(!author){
            showAlert("Vui lòng nhập tên tác giả!", 3000, "alert--error");
            return;
        }

        const data = {
            title: title,
            price: parseInt(price),
            author: author
        };
        axios.post("http://localhost:3000/books", data)
            .then(res => {
                showAlert("Tạo sách thành công");
                formCreate.reset();
            })
    });
}

const formEdit = document.querySelector("#form-edit");
if(formEdit){
    const params = new URL(window.location.href).searchParams;
    const id = params.get("id");
    axios.get(`http://localhost:3000/books/${id}`)
        .then(res => {
            formEdit.title.value = res.data.title;
            formEdit.price.value = res.data.price;
            formEdit.author.value = res.data.author;

            formEdit.addEventListener("submit", (event) => {
                event.preventDefault();
        
                const title = formEdit.title.value;
                const price = formEdit.price.value;
                const author = formEdit.author.value;
        
                if(!title){
                    showAlert("Vui lòng nhập tiêu đề!", 3000, "alert--error");
                    return;
                }
        
                if(!price){
                    showAlert("Vui lòng nhập giá của cuốn sách!", 3000, "alert--error");
                    return;
                }
        
                if(!author){
                    showAlert("Vui lòng nhập tên tác giả!", 3000, "alert--error");
                    return;
                }
        
                const data = {
                    title: title,
                    price: parseInt(price),
                    author: author
                };
                axios.patch(`http://localhost:3000/books/${id}`, data)
                    .then(res => {
                        showAlert("Cập nhật sách thành công");
                    })
            });
        })
}