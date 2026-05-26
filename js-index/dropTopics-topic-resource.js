(function(){
    const dropTopics = document.querySelectorAll('.drop-topic')
    const dropSubTopic = document.querySelectorAll('.drop-sub-topic')
    const subResourcesContainers = document.querySelectorAll('.sub-resources-container')
    const subTopicsContainers = document.querySelectorAll('.sub-topics-container')
    function hideSubResources() {
        subResourcesContainers.forEach(el => {
            if (!el.classList.contains('show')) {
                const resources = el.querySelectorAll('.resource')
                resources.forEach(el => {
                    el.classList.add('hide')
                })
            }
        })
    }
    function hdieSubTopicsContainers() {
        if(subTopicsContainers){
            subTopicsContainers.forEach(el => {
                if (!el.classList.contains('show')) {
                    el.classList.add('hide')
                }
            })
        }
    }
    hideSubResources()
    hdieSubTopicsContainers()

    dropTopics.forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault()
            toggleResources(e)
        })
        el.addEventListener('keydown', e => {
            let letter = e.key.toLowerCase()
            if (letter == 'enter') {
                e.preventDefault()
                toggleResources(e)
            }
        })
    })
    dropSubTopic.forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault()
            toggleSubTopics(e)
        })
    })
    function toggleResources(e) {
        const topicContainer = getTopicContainer(e.target.parentElement)
        if(topicContainer){
            const subResourcesContainer = topicContainer.querySelector('.sub-resources-container')
            if(subResourcesContainer){
                const resources = subResourcesContainer.querySelectorAll('.resource')
                if(resources){    
                    resources.forEach(el => {
                        el.classList.toggle('hide')
                    })
                }
            }
            const subTopicsContainer = topicContainer.querySelector('.sub-topics-container')
            if(subTopicsContainer){
                subTopicsContainer.classList.toggle('hide')
                const projects = subTopicsContainer.querySelectorAll('.project')
            }
        }
    }
    function toggleSubTopics(e){
        const subTopic = getSubTopic(e.target)
        const subTopicContainer = subTopic.querySelector('.sub-topic-container')
        subTopicContainer.classList.toggle('hide')
    }


    function getTopicContainer(parent) {
        if (parent.classList.contains('topic-container')) {
            return parent
        } else if (parent.parentElement) {
            return getTopicContainer(parent.parentElement)
        } else {
            return null
        }
    }
    function getSubTopic(parent) {
        if (parent.classList.contains('sub-topic')) {
            return parent
        } else if (parent.parentElement) {
            return getSubTopic(parent.parentElement)
        } else {
            return null
        }
    }
    
}())