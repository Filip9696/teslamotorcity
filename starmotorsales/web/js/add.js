window.addEventListener('load', () => {
    if (car.id !== "${id}") {
        for (let field in car) {
            console.log(field);
            if (document.forms[0][field].length == undefined) {
                document.forms[0][field].value = car[field];
            } else {
                if (field === 'drive') {
                    switch (car[field]) {
                        case 'Front wheel drive': document.forms[0][field][2].checked = true;
                        case 'Rear wheel drive': document.forms[0][field][1].checked = true;
                        case 'All wheel drive': document.forms[0][field][0].checked = true;
                    }
                } else if (field === 'transmission') {
                    switch (car[field]) {
                        case 'Automatic': document.forms[0][field][1].checked = true;
                        case 'Manual': document.forms[0][field][0].checked = true;
                    }
                } else if (field === 'fuel') {
                    switch (car[field]) {
                        case 'Gas': document.forms[0][field][2].checked = true;
                        case 'Hybrid': document.forms[0][field][1].checked = true;
                        case 'Electric': document.forms[0][field][0].checked = true;
                    }
                }
            }
        }
        renderImages();
        M.updateTextFields();
    }
});

let renderImages = () => {
    let tbody = document.getElementById('images');
    let out = '';
    let i = 0;
    for (let img of images) {
        console.log(img);
        out += `<tr><td width="50%"><img style="responsive-img" width="100%" src="/img/${img}"></td>`;
        out += `<td><div class="row center"><a class="btn amber darken-2" href="#" onclick="removeImg(${i})">Remove</a></div>`;
        out += `<div class="row center"><a class="btn amber darken-2${(i<1)?' disabled':''}" onclick="imgUp(${i})"><i class="material-icons">arrow_upward</i></a>`;
        out += `<a class="btn amber darken-2${(i>=images.length-1)?' disabled':''}" onclick="imgDown(${i})"><i class="material-icons">arrow_downward</i></a></div></td>`;
    }
    tbody.innerHTML = out;
}

let getRadioValue = (radios) => {
    for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                return radios[i].value;
                break;
            }
      }
}

let addFormSubmit = () => {
    let newcar = {
        id: car.id,
        make: document.forms[0].make.value,
        model: document.forms[0].model.value,
        year: document.forms[0].year.value,
        vin: document.forms[0].vin.value,
        price: document.forms[0].price.value,
        description: document.forms[0].description.value,
        body: document.forms[0].body.value,
        color: document.forms[0].color.value,
        engine: document.forms[0].engine.value,
        drive: getRadioValue(document.forms[0].drive),
        cylinders: document.forms[0].cylinders.value,
        transmission: getRadioValue(document.forms[0].transmission),
        fuel: getRadioValue(document.forms[0].fuel),
        images: images
    }

    console.log(newcar);

    fetch('/api/car/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newcar)
    }).then((res) => {
        if (res.status !== 200) {
            console.error(res);
            M.toast({html: 'Something went wrong<br>'+res.message});
        } else {
            window.location.replace('/admin.html');
        }
    });
}

let uploadImages  = () => {
    let files = document.forms[1].imageUpload.files;
    console.log(files);
    let promises = [];
    for (let img of files) {
        promises.push(new Promise((resolve, reject) => {
            fetch('/api/image/add', {
                method: 'POST',
                body: img
            }).then(res => res.json()).then(res => resolve(res));
        }))
    }
    Promise.all(promises).then((files) => {
        for (let img of files) {
            if (img.status !== 200) {
                M.toast({html: 'Failed upload image<br>'+img.message});
            } else {
                images.push(img.message);
            }
        }
        renderImages();
        document.forms[1].reset();
    });
}

document.forms[1].imageUpload.addEventListener('change', uploadImages, false);