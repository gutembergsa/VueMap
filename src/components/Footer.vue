<template>
    <footer class="footer has-background-light">
        <div id="footerContent1" class="section animated is-hidden">
            <article class="media">
                <div class="media-content">
                    <div class="content">
                        <p>
                            <figure class="media-left">
                                <p class="image is-96x96 center">
                                    <img class="is-rounded" src="../../public/img/foto.jpg">
                                </p>
                            </figure>
                            <label class=" label is-size-6 fottxt center">Gutemberg Sá</label>
                            <br>
                            Olá, seja bem-vindo a uma de minhas aplicações pela internet hehe. Meu nome
                            você já sabe, o que não deve saber é que sou formado em tecnologia mecatrônica,
                            e venho desde de 2016 me especializando  em internet das coisas e nos conceitos e
                            tecnologias da indústria 4.0, esta aplicação é uma demonstração de meus conhecimentos
                            em desenvolvimento web e programação tão necessárias nessas áreas emergentes :).
                        </p>
                    </div>
                </div>
            </article>            
        </div>
        <div id="footerContent2" class="section animated fadeIn">
                    <div class="content">
                        <p>
                            <label class="label fottxt center is-size-4">VueMAP</label>
                            <br>
                            Esta é uma aplicação sem fins uteis reais, apenas para fins didáticos, o VueMAP
                            traz em sua stack tecnologias emergentes e conceitos novos que priorizam a experiência
                            de usuário, funcionando como um marcador de mapa esta aplicação permite a criação e
                            gerenciamento de listas de pontos ou rotas que podem ser facilmente visualizados no mapa disponível
                            logo acima, esta aplicação roda no browser e pode ser instalada sem consumir recursos de seu device
                            para tornar a aplicação mais rápida e melhorando ainda mais sua experiencia de na utilização do app! Meu intuito
                            ao desenvolver esta aplicação foi aprender como criar interfaces fluidas e bonitas sem abrir mão
                            da performance, tão importante nas soluções de embarcados onde o uso de dados deve ser otimizado.

                        </p>
                    </div>
                    <label class="label fottxt center is-size-4">Stack utilizada</label>
                     
                    <div class="card">
                        <div class="colums">
                            <div class="column is-paddingless">
                                <figure class="image is-96x96 center">
                                    <img src="../../public/img/animate-logo.png">
                                </figure>
                            </div>
                            <div class="column is-paddingless">
                                <figure class="image is-96x96 center">
                                    <img src="../../public/img/vue-logo.png">
                                </figure>
                            </div>
                            <div class="column is-paddingless space1">
                                <figure class="image is-96x96 center">
                                    <img src="../../public/img/bulma-logo.png">
                                </figure>
                            </div>
                            <div class="column is-paddingless space2">
                                <figure class="image is-96x96 center">
                                    <img src="../../public/img/indexeddb-logo.png">
                                </figure>
                            </div>
                        </div>
                    </div>
        </div>
        <div id="footerContent3" class="section animated is-hidden">
            <article class="media">
                <div class="media-content">
                    <div class="content">
                        <label class="label has-text-centered">
                            MIT License Copyright (c) 2019 Gutemberg Sá <br><br>
                        </label>
                        <p class="has-text-justified">
                            Permission is hereby granted, free of charge, to any person obtaining a copy
                            of this software and associated documentation files (the "Software"), to deal
                            in the Software without restriction, including without limitation the rights
                            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                            copies of the Software, and to permit persons to whom the Software is
                            furnished to do so, subject to the following conditions:

                            The above copyright notice and this permission notice shall be included in all
                            copies or substantial portions of the Software.

                            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                            SOFTWARE.

                        </p>
                    </div>
                </div>
            </article>            
        </div>
        <div class="field has-addons has-addons-centered">
            <div class="control">
                <button class="button is-rounded" @click.prevent="switchFooter(0)" :class="{'is-small': !this.flag}">
                    <span class="icon">
                    <i class="fas fa-user-tie"></i>
                    </span>
                    <span>Sobre mim</span>                
                </button>
            </div>
            <div class="control">
                <button class="button" @click.prevent="switchFooter(1)" :class="{'is-small': !this.flag}">
                    <span class="icon">
                    <i class="fas fa-map-marked-alt"></i>
                    </span>
                    <span>Sobre o VueMAP</span>                
                </button>                
            </div>
            <div class="control">
                <button class="button is-rounded" @click.prevent="switchFooter(2)" :class="{'is-small': !this.flag}">
                    <span class="icon">
                    <i class="fas fa-copyright"></i>
                    </span>
                    <span>Licença</span>                
                </button>                
            </div>
        </div>
    </footer>  
</template>

<script>
export default {
    name: 'Footer',
    data(){
        return{
            flag: window.screen.width <= 425 ? false : true,
            flag2: 1,
            flag3: null,
            elemList: []
        }
    },
    mounted(){
        this.elemList = [document.getElementById('footerContent1'),
                        document.getElementById('footerContent2'),
                        document.getElementById('footerContent3')];

        window.addEventListener('resize', ()=> {
            if (window.screen.width <= 425) {
                this.flag = false;
            } else {
                this.flag = true;
            }

            if (window.screen.width <= 768) {
                console.log('1');
                this.flag3 = false;
            } else {
                console.log('2');
                this.flag3 = true;
            }
        });
    },
    methods:{
        switchFooter(flag){
            this.flag2 = flag;
            if (this.flag2 === 0) {
                this.fade(this.elemList, 0, 1, 2); 
            }
            else if(this.flag2 === 1){
                this.fade(this.elemList, 1, 0, 2); 
            }
            else if(this.flag2 === 2){
                this.fade(this.elemList, 2, 0, 1); 
            }
        },
        fade(aux, el, op1, op2){
                if (aux[op1].classList.contains('fadeIn')) {
                    aux[op1].classList.remove('fadeIn')
                    aux[op1].classList.add('fadeOut')
                    setTimeout(() => {
                        aux[op1].classList.add('is-hidden')
                        aux[el].classList.remove('is-hidden', 'fadeOut')
                        aux[el].classList.add('fadeIn')
                    }, 1000);
                }
                if (aux[op2].classList.contains('fadeIn')) {
                    aux[op2].classList.add('fadeOut')
                    setTimeout(() => {
                        aux[op2].classList.add('is-hidden')
                        aux[el].classList.remove('is-hidden', 'fadeOut')
                        aux[el].classList.add('fadeIn')
                    }, 1000);
                }

        }
    }
}
</script>

<style>
.position{
    width: auto;
}
.fottxt{
    text-align: center;
}
.space1{
    margin-top: 10px;
}
.space2{
    margin-top: -40px;
}
.stacks{
    border: 1px solid black;    
}
.left{
    padding-left: 5%;
}
.center{
    margin-left: auto;
    margin-right: auto;
}   

</style>