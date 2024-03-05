const form = document.querySelector('#enigma--machine');
const input = document.querySelector('#input');
const output = document.querySelector('#output');
const reverse = document.querySelector('#reverse');
const saveBtn = document.querySelector('#save');
const deleteBtn = document.querySelector('#delete');
const enigmaHeaderPrimary = document.querySelector('#enigma--header--primary');
const enigmaHeaderSecundary = document.querySelector('#enigma--header--secundary');
const savesItems = document.querySelector('#saves--items');
const savesContainerBtn = document.querySelector('.saves--header');

const enigma = {
  order: 'encrypt', // decrypt, encrypt
  secret: {
    'e': 'enter',
    'i': 'imes',
    'a': 'ai',
    'o': 'ober',
    'u': 'ufat'
  },
  approved: true,
  input: '',
  output: '',
  saves: [],

  decrypt(decryptValue) {
    decryptValue = this.input;

    Object.keys(this.secret).map((character) => {
      decryptValue = decryptValue.replaceAll(this.secret[character], character);
    })

    enigma.value.handler(this.input, decryptValue);
  },
  encrypt(encryptValue) {
    encryptValue = this.input;

    Object.keys(this.secret).map((character) => {
      encryptValue = encryptValue.replaceAll(character, this.secret[character]);
    })

    enigma.value.handler(this.input, encryptValue);
  },
  handler() {
    if (this.order === 'decrypt') {
      this.decrypt();
    } else if (this.order === 'encrypt') {
      this.encrypt();
    }

    enigma.save.verify([this.input, this.output]);
  },
  verify(value) {
    this.approved = true;

    const textVerify = value.split(' ')
      .map(word => {
        const regex = /[^a-z]+/g;
        const metches = word.match(regex) || [];
        const approved = metches.length === 0;
        
        // mark error
        if (!approved) {
          metches?.map((special) => {
            word = word.replaceAll(special, `<mark>${special}</mark>`);
          });

          this.approved = false;
        }
        
        return word;
      })
      .join(' ');
    
    if (!this.approved) {
      this.value.handler(textVerify, 'Caractere não suportado...');
      return;
    }

    console.log(textVerify);
    this.value.handler(textVerify);
    this.handler();
  },
  changeMachineOrder() {
    if (!this.approved) {
      alert('Há pendências a serem resolvidas');
      return;
    }

    if (this.order === 'encrypt') {
      this.order = 'decrypt';
      enigmaHeaderPrimary.querySelector('h2').textContent = 'Criptografado';
      enigmaHeaderSecundary.querySelector('h2').textContent = 'Descriptografado';
      
    } else if (this.order === 'decrypt') {
      this.order = 'encrypt';
      enigmaHeaderPrimary.querySelector('h2').textContent = 'Descriptografado';
      enigmaHeaderSecundary.querySelector('h2').textContent = 'Criptografado';
    }

    this.input = this.output;
    this.output = this.input;
    this.handler();
    this.loadMachine();
  },
  loadMachine() {
    output.querySelector('.enigma--machine--content').innerHTML = this.output;
    input.querySelector('.content').innerHTML = this.input;
    input.querySelector('textarea').value = this.input
      .replaceAll('<mark>', '')
      .replaceAll('</mark>', '');
  },

  save: {
    handler(){
      if (!enigma.approved) {
        alert('Há caracteres incompatíveis!')
        return;
      }
      if (enigma.input === '') {
        return;
      }

      const newItem = [
        enigma.input,
        enigma.output,
      ]
      const exist = this.verify(newItem);

      if (!exist[0]) {
        this.push(newItem);
      } else {
        this.remove(exist[1]);
      }
      
      this.load();
      this.verify(newItem);
    },
    verify([input, output]){
      let exist = false,
          index;
      
      enigma.saves
        .some((item, i) => {
          if (item[0] === input && item[1] === output) {
            exist = true;
            index = i;
          }
        })

      if (exist) {
        saveBtn.classList.add('active');
      } else {
        saveBtn.classList.remove('active');
      }

      return [exist, index];
    },
    remove(value) {
      if(!confirm('Deseja remover o item da lista de salvos?')){
        return;
      }

      enigma.saves.splice(value, 1);
      this.load();
    },
    push(item){
      enigma.saves.unshift(item);
    },
    load(){
      savesItems.innerHTML = '';

      enigma.saves
        .map((item, index) => {
          const element = ` <li class="item">
          <div class="saves--item--input">
            <p>${item[0]}</p>
            <div class="saves--item--footer flex">
              <div class="saves--item--footer--primary">
                <i id="speaker" class="icon icon--speaker" onclick="speaker.handler('${item[0]}', this)">
                  <img src="./images/speaker-off.svg" class="off" alt="Ler texto"/>
                  <img src="./images/speaker-on.svg" class="on" alt="Para leitura"/>
                </i>
              </div>
              <div class="saves--item--footer--secundary">
                <i class="icon" onclick="clipboard('${item[0]}');">
                  <img src="./images/copy.svg" alt="Copiar resultado para área de trabalho"/> 
                </i>
              </div>
            </div>
          </div>
          <i>
            <img src="./images/right-arrow.svg" alt="seta" />
          </i>
          <div class="saves--item--output">
            <p>${item[1]}</p>
            <div class="saves--item--footer flex">
              <div class="saves--item--footer--primary">
                <i id="speaker" class="icon icon--speaker" onclick="speaker.handler('${item[1]}', this)">
                  <img src="./images/speaker-off.svg" class="off" alt="Ler texto"/>
                  <img src="./images/speaker-on.svg" class="on" alt="Para leitura"/>
                </i>
              </div>
              <div class="saves--item--footer--secundary">
                <i id="save" class="icon icon--star active" onclick="enigma.save.remove(${index})">
                  <img src="./images/star-off.svg" class="off" alt="Salvar resultado"/>
                  <img src="./images/star-on.svg" class="on" alt="Remover da lista de salvos"/>
                </i>
                <i class="icon" onclick="clipboard('${item[1]}');">
                  <img src="./images/copy.svg" alt="Copiar resultado para área de trabalho"/> 
                </i>
              </div>
            </div>
          </div>
        </li>`

          savesItems.innerHTML += element;
        })
    }
  },
  value: {
    handler(input, output) {
      enigma.input = input;
      enigma.output = output;
      enigma.loadMachine();
    },
    delete() {
      enigma.input = '';
      enigma.output = '';
      enigma.loadMachine();
    }
  }
}

input.querySelector('textarea')
  .addEventListener('input', (e) => {
    const value = e.currentTarget.value;
    enigma.verify(value);
  });
reverse.addEventListener('click', () => {
  enigma.changeMachineOrder();
});
saveBtn.addEventListener('click', () => {
  enigma.save.handler();
});
deleteBtn.addEventListener('click', () => {
  enigma.value.delete();
});
savesContainerBtn.addEventListener('click', () => {
  document.querySelector('#saves').classList.toggle('active');
});