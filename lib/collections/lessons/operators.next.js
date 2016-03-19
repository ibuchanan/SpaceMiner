const env = {
    
    equalityPrograms() {
        return program('comp1', '1 === 0', true)
        + program('comp2', '4 === 4', true)
        + program('comp3', '2 + 2 === 4', true);
    },

    inequalityPrograms() {
        return program('comp4', '1 !== 0', true)
        + program('comp5', '4 !== 40', true)
        + program('comp6', '50 / 2 !== 25', true);
    },

    equalityAndInequalityPrograms() {
        return this.equalityPrograms() +
            this.inequalityPrograms();
    }

};

markdownLesson('operators.md', 'operators', env);