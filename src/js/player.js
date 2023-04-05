$(function () {

    var currentKey = 'x';

    var playButton = document.querySelector('#play-icon');
    var pauseButton = document.querySelector('#pause-icon');
    var muteButton = document.querySelector('#mute-icon');
    var unmuteButton = document.querySelector('#unmute-icon');
    var volumeInput = document.querySelector('.audioplayer_volume input');

    var audioProgress = document.querySelector('.audioplayer_progress');

    $(document).on('click', '.single_mix', function () {
        var key = this.getAttribute('data-key');

        if (typeof waveSurfers !== 'undefined' && waveSurfers instanceof Object && key in waveSurfers) {
            if (currentKey != key && currentKey != 'x') {
                waveSurfers[currentKey].pause();
                waveSurfers[key].setMute(waveSurfers[currentKey].getMute());
                waveSurfers[key].setVolume(waveSurfers[currentKey].getVolume());
            }


            if ( ! waveSurfers[key].isPlaying()) {
                waveSurfers[key].play();
                $(playButton).addClass('hidden');
                $(pauseButton).removeClass('hidden');
            }

            currentKey = key;
        }
    });

    $(playButton).on('click',function() {
        if(currentKey == 'x')  {
            $('#mix_0').trigger('click');
            return;
        };
        $(playButton).addClass('hidden');
        $(pauseButton).removeClass('hidden');
        waveSurfers[currentKey].play();
    });

    $(pauseButton).on('click',function() {
        if(currentKey == 'x') return;
        $(playButton).removeClass('hidden');
        $(pauseButton).addClass('hidden');
        waveSurfers[currentKey].pause();
    });

    $(muteButton).on('click',function() {
        if(currentKey == 'x') return;
        $(unmuteButton).removeClass('hidden');
        $(muteButton).addClass('hidden');
        waveSurfers[currentKey].setMute(true);
    });

    $(unmuteButton).on('click',function() {
        if(currentKey == 'x') return;
        $(unmuteButton).addClass('hidden');
        $(muteButton).removeClass('hidden');
        waveSurfers[currentKey].setMute(false);
    });

    $(volumeInput).on('change',function() {
        if(currentKey == 'x') return;
        var newVolume = this.value;
        waveSurfers[currentKey].setVolume(newVolume);
    });

});
