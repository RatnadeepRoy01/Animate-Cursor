interface Character {
    mainCharacter: string;
    setting: string;
    style: string;
    colors: string;
}

interface AnimationStep {
    step: number;
    description: string;
}

export function parseAnimationSteps(breakdownText: string): {
    characterInfo: Character;
    steps: AnimationStep[];
} {
    const lines = breakdownText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    const characterInfo: Character = {
        mainCharacter: '',
        setting: '',
        style: '',
        colors: ''
    };

    const steps: AnimationStep[] = [];

    for (const line of lines) {
        if (line.toLowerCase().startsWith('main character:')) {
            characterInfo.mainCharacter = line.split(':')[1].trim();
        } else if (line.toLowerCase().startsWith('setting:')) {
            characterInfo.setting = line.split(':')[1].trim();
        } else if (line.toLowerCase().startsWith('style:')) {
            characterInfo.style = line.split(':')[1].trim();
        } else if (line.toLowerCase().startsWith('colors:')) {
            characterInfo.colors = line.split(':')[1].trim();
        } else if (/^\d+\./.test(line)) {
            const match = line.match(/^(\d+)\.\s*(.*)$/);
            if (match) {
                steps.push({
                    step: parseInt(match[1], 10),
                    description: match[2].trim()
                });
            }
        }
    }

    return { characterInfo, steps };
}
