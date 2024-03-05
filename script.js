const form = document.querySelector('#enigma--machine');
const input = document.querySelector('#input');
const output = document.querySelector('#output');
const reverse = document.querySelector('#reverse');
const saveBtn = document.querySelector('#save');
const deleteBtn = document.querySelector('#delete');
const enigmaHeaderPrimary = document.querySelector('#enigma--header--primary');
const enigmaHeaderSecundary = document.querySelector('#enigma--header--secundary');
const savesItems = document.querySelector('#saves--items');

const enigma = {
  machine: {
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
  },

  handlerMachine: {
    decrypt(decryptValue) {
      decryptValue = enigma.machine.input;

      Object.keys(enigma.machine.secret).map((character) => {
        decryptValue = decryptValue.replaceAll(enigma.machine.secret[character], character);
      })

      enigma.value.handler(enigma.machine.input, decryptValue);
    },
    encrypt(encryptValue) {
      encryptValue = enigma.machine.input;

      Object.keys(enigma.machine.secret).map((character) => {
        encryptValue = encryptValue.replaceAll(character, enigma.machine.secret[character]);
      })

      enigma.value.handler(enigma.machine.input, encryptValue);
    },
    handler() {
      if (enigma.machine.order === 'decrypt') {
        this.decrypt();
      } else if (enigma.machine.order === 'encrypt') {
        this.encrypt();
      }

      enigma.save.verify([enigma.machine.input, enigma.machine.output]);
    }
  },
  save: {
    handler(){
      if (!enigma.machine.approved) {
        alert('Há caracteres incompativeis!')
        return;
      }
      if (enigma.machine.input === '') {
        return;
      }

      const newItem = [
        enigma.machine.input,
        enigma.machine.output,
      ]
      const exist = this.verify(newItem);

      if (!exist[0]) {
        this.push(newItem);
      } else if(confirm('Deseja remover da lista de salvos?')){
        this.remove(exist[1]);
      }

      this.load();
      this.verify(newItem);
    },
    verify([input, output]){
      let exist = false,
          index;
      
      enigma.machine.saves
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
      const current = [
        enigma.machine.input,
        enigma.machine.output,
      ];

      enigma.machine.saves.splice(value, 1);
      this.load();
      this.verify(current);
    },
    push(item){
      enigma.machine.saves.unshift(item);
    },
    load(){
      savesItems.innerHTML = '';

      enigma.machine.saves
        .map((item, index) => {
          const element = ` <li class="item">
          <div class="saves--item--input">
            <p>${item[0]}</p>
            <div class="saves--item--footer flex">
              <div class="saves--item--footer--primary">
                <i id="speaker" class="icon icon--speaker" onclick="enigma.speaker.handler('${item[0]}', this)">
                  <img src="./images/speaker-off.svg" class="off" alt="Ler texto"/>
                  <img src="./images/speaker-on.svg" class="on" alt="Para leitura"/>
                </i>
              </div>
              <div class="saves--item--footer--secundary">
                <i class="icon" onclick="enigma.clipboard('${item[0]}');">
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
                <i id="speaker" class="icon icon--speaker" onclick="enigma.speaker.handler('${item[1]}', this)">
                  <img src="./images/speaker-off.svg" class="off" alt="Ler texto"/>
                  <img src="./images/speaker-on.svg" class="on" alt="Para leitura"/>
                </i>
              </div>
              <div class="saves--item--footer--secundary">
                <i class="icon" onclick="enigma.clipboard('${item[1]}');">
                  <img src="./images/copy.svg" alt="Copiar resultado para área de trabalho"/> 
                </i>
                <i id="save" class="icon icon--star active" onclick="enigma.save.remove(${index})">
                  <img src="./images/star-off.svg" class="off" alt="Salvar resultado"/>
                  <img src="./images/star-on.svg" class="on" alt="Remover da lista de salvos"/>
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
      enigma.machine.input = input;
      output != null ? enigma.machine.output = output : null;
      enigma.load();

    },
    delete() {
      enigma.machine.input = '';
      enigma.machine.output = '';
      enigma.load();
    }
  },
  
  verify(value) {
    this.machine.approved = true;

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

          this.machine.approved = false;
        }
        
        return word;
      })
      .join(' ');
    
    if (!this.machine.approved) {
      this.value.handler(textVerify, 'Caractere não suportado...');
      return;
    }

    this.value.handler(textVerify);
    this.handlerMachine.handler();
  },
  changeMachineOrder(input, output) {
    
    if (!this.machine.approved) {
      alert('Há pendencias a serem resolvidas');
      return;
    }

    input = this.machine.input;
    output = this.machine.output;

    if (this.machine.order === 'encrypt') {
      this.machine.order = 'decrypt';
      enigmaHeaderPrimary.querySelector('h2').textContent = 'Criptografado';
      enigmaHeaderSecundary.querySelector('h2').textContent = 'Descriptografado';
      
    } else if (this.machine.order === 'decrypt') {
      this.machine.order = 'encrypt';
      enigmaHeaderPrimary.querySelector('h2').textContent = 'Descriptografado';
      enigmaHeaderSecundary.querySelector('h2').textContent = 'Criptografado';
    }

    this.machine.input = output;
    this.machine.output = input;
    this.handlerMachine.handler();
    this.load();
  },
  load() {
    input.querySelector('.content').innerHTML = this.machine.input;
    input.querySelector('textarea').value = this.machine.input
      .replaceAll('<mark>', '')
      .replaceAll('</mark>', '');
    output.querySelector('.enigma--machine--content').innerHTML = this.machine.output;
  },
  clipboard(value) {
    console.log(value);
    navigator.clipboard.writeText(value);
  },
  speaker: {
    active: false,
    handler(text, element) {
      if (!this.active) {
        this.active = true;
        responsiveVoice.speak(text, 'Brazilian Portuguese Female', {
          onend: () => {
            element.classList.remove('active');
          }
        });
        element.classList.add('active');
      } else {
        this.active = false;
        responsiveVoice.cancel();
        element.classList.remove('active');
      }
    }
  }
}

input.querySelector('textarea')
  .addEventListener('input', (e) => {
    const element = e.currentTarget
    const value = element.value;
    enigma.verify(value);
  });

reverse.addEventListener('click', () => {
  enigma.changeMachineOrder();
});

saveBtn.addEventListener('click', () => {
  enigma.save.handler();
})

deleteBtn.addEventListener('click', () => {
  enigma.value.delete();
})