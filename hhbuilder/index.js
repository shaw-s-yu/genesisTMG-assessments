class HHBuilder {
    constructor() {
        this.form = document.getElementsByTagName('form')[0];
        this.debugBox = document.querySelector("pre.debug");
        this.ageInput = document.getElementById('age');
        this.ageInput.type = 'number';
        this.relationshipDropdown = document.getElementById('rel')
        this.smokerCheckbox = document.getElementById('smoker')
        const buttons = document.getElementsByTagName('button');
        [...buttons].forEach(button => {
            if (button.className === "add") {
                this.addButton = button;
            } else {
                this.submitButton = button;
            }
        })

        this.displayArea = document.querySelector("ol.household");

        this.errorList = document.createElement("div");
        this.errorList.setAttribute("id", "error-list");
        this.form.insertBefore(this.errorList, this.form.firstChild);

        this.json = {
            errors: [],
            data: [],
            submittedData: '',
        }

        this.init_inputs();
        this.build_controller();

    }

    build_controller() {
        this.addButton.onclick = e => {
            e.preventDefault();
            const age = this.ageInput.value;
            const relationship = this.relationshipDropdown.value;
            const id = (new Date()).getTime();
            const isSmoker = this.smokerCheckbox.checked;
            this.clear_form();
            this.json.errors = this.get_errors(age, relationship);
            if(this.json.errors.length===0){
                this.json.data.push({age, id, isSmoker, relationship});
            }
            this.build_all_hh();
        }
        this.submitButton.onclick = e =>{
            e.preventDefault();
            this.json.submittedData = JSON.stringify(this.json.data, null, 2)
            this.build_all_hh();
            this.debugBox.style.display = 'block'
        }
    }

    build_all_hh(){
        const {errors, data, submittedData} = this.json;
        this.errorList.innerText = errors.join('; ');
        this.debugBox.innerText = submittedData;
        this.displayArea.innerHTML = null;
        data.forEach(({id, age, relationship, isSmoker})=>this.build_hh(
            id,
            age,
            relationship,
            isSmoker
        ))
    }

    build_hh(id, age, relationship, isSmoker) {
        const wrapper = document.createElement('div');

        const ageSpan = document.createElement('span');
        ageSpan.innerText = `Age: ${age};`;
        wrapper.appendChild(ageSpan);

        const relationshipSpan = document.createElement('span');
        relationshipSpan.innerText = `Relationship: ${relationship};`;
        wrapper.appendChild(relationshipSpan);

        const isSmokerSpan = document.createElement('span');
        isSmokerSpan.innerText = `Is Smoker: ${isSmoker ? 'YES' : 'NO'};`;
        wrapper.appendChild(isSmokerSpan);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => {
            this.json.data=this.json.data.filter(datum=>id!==datum.id)
            document.getElementById(id).remove();
        }
        wrapper.appendChild(deleteButton);

        wrapper.setAttribute('id', id);
        this.displayArea.appendChild(wrapper)
    }

    get_errors(age, relationship) {
        const errors = []
        if(age == null || age==''){
            errors.push('Age is required');
        }else if(age <= 0){
            errors.push('Age should be more than 0');
        }
        if(relationship == 0){
            errors.push('Relationship is required');
        }
        return errors;
    }

    clear_form() {
        this.ageInput.value = "";
        this.relationshipDropdown.selectedIndex = null;
        this.smokerCheckbox.checked = false;
        this.errorList.innerHTML = ""
    }

    init_inputs() {
        // this.form.onsubmit = () => {
        //     this.debugBox.innerHTML(JSON.stringify(this.json));
        // }
        this.ageInput.required = true;
        this.ageInput.type = 'number';
        this.relationshipDropdown.required = true;
    }
}

new HHBuilder();
