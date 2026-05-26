class Person{
    talk(){
        return 'Talking'
    }
}
const me = new Person()
function newMethod(){
    return 'new Method'
}
me.talk = newMethod()