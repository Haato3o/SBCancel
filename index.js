const DELAY = 180; // SBCancel delay in ms

// Stuff
const SB_1 = 181100;
const SB_2 = 181101;
const BLOCK = 20200;

module.exports = function SbCancel(mod) {
    let lancer;
    let enabled = true;
    let w;
    let loc;
    
    mod.command.add('sbcancel', () => {
        enabled = !enabled;
        mod.command.message(`SBCancel is now ${enabled ? 'en' : 'dis'}abled.`)
    })

    function dispatchInjectedSBCancel() {
        mod.toServer('C_PRESS_SKILL', 4, {
            skill: {reserved: 0, npc: false, type: 1, huntingZoneId: 0, id: BLOCK},
            press: true,
            loc: loc,
            w: w
        })
        setTimeout(function(){
            mod.toServer('C_PRESS_SKILL', 4, {
                skill: {reserved: 0, npc: false, type: 1, huntingZoneId: 0, id: BLOCK},
                press: false,
                loc: loc,
                w: w
            })
        }, 10)
        setTimeout(function(){
            mod.toServer('C_START_SKILL', 7, {
                skill: {reserved: 0, npc: false, type: 1, huntingZoneId: 0, id: SB_2},
                w: w,
                loc: loc,
                dest: {x: 0, y: 0, z: 0},
                unk: true,
                moving: false,
                continue: false,
                target: 0n,
                unk2: false
            })
        }, 20)
    }
    
    mod.hook('S_LOGIN', 12, (event) => {
        lancer = ((event.templateId - 10101) % 100) == 1;
    });

    mod.hook('C_PLAYER_LOCATION', 5, {order: -999999}, (event) => {
        if (lancer && enabled) { 
            loc = event.dest;
        }
    });

    mod.hook('C_START_SKILL', 7, {order: -999999}, (event) => {
        if (event.skill.id == SB_1 && lancer && enabled) {
            w = event.w;
            setTimeout(function(){
                dispatchInjectedSBCancel()
            }, DELAY)
        }
    })
}