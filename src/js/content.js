$ = jQuery;
var contentsJson;
var waveSurfers = [];
var MinimapPlugin = window.WaveSurfer.minimap;

$(function () {
    $('.content_tabs_select_el').on('click', function () {
        console.log('click');
        var target = this.getAttribute('data-id');

        $('.content_tabs_select_el').removeClass('selected');
        $('.content_tabs_selections_el').removeClass('selected');

        $(this).addClass('selected');
        $('#' + target).addClass('selected');
    });


    async function populate_mixes() {
        var mixes = contentsJson.audio.mixes.files;
    

            for(var key in mixes) {
                if(mixes[key].includes('.json') || mixes[key].includes('.dat')) continue;
                let mix = document.createElement('div');
                mix.innerHTML = '<h3>'+mixes[key]+'</h3>';
                mix.setAttribute('id','mix_'+key);
                mix.setAttribute('data-key', key);
                mix.setAttribute('class', 'single_mix');


                let loader = document.createElement('div');
                loader.setAttribute('class', 'loader');
                loader.innerHTML = 'Waveform Loading';
                $(mix).append(loader);

                $('#content-tab-mixes').append(mix);
    
                waveSurfers[key] = WaveSurfer.create({
                    container: '#mix_'+key,
                    waveColor: '#e2715d',
                    barWidth: 2,
                    progressColor: '#ff211e',
                    //backend: 'MediaElementWebAudio',
                    normalize: true,
                    //mediaControls: true,
                    scrollParent: true,
                    partialRender: true,
                    hideScrollbar: true,
                    plugins: [
                        MinimapPlugin.create({
                          // plugin options ...
                        })
                      ]
                });

                waveSurfers[key].on('ready', function() {
                    loader.remove();
                });

                waveSurfers[key].on('error', message => {
                    console.log(message);
                });

                waveSurfers[key].on('audioprocess', function () {
                
                    // Draw the waves
                    waveSurfers[key].drawBuffer();
                });

                waveSurfers[key].load('./build/audio/mixes/'+mixes[key]);

                // let waveJson = mixes[key].replace(/\.[^.]+$/, '.json');
                // fetch('./build/audio/mixes/'+waveJson)
                // .then((response) => {
                //     if (!response.ok) {
                //         throw new Error("HTTP error " + response.status);
                //     }
                //     return response.json();
                // })
                // .then((json) => {
                //     //console.log(json);
                //     waveSurfers[key].load('./build/audio/mixes/'+mixes[key], json);
                // });
            }



    }


    fetch('./build/contents.json')
        .then((response) => response.json())
        .then(async (json) => {
            console.log(json);
            contentsJson = json;

            await populate_mixes();
        });


    //create mixes elements
    
});