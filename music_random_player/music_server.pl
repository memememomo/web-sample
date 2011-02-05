use utf8;


### Model

package MusicServer::Model;
use strict;
use warnings;
use File::Basename;

my $music_dir  = dirname(__FILE__) . '/public/music';
my $music_url = "http://localhost:3000/music/";

sub next_music_name {
    my ($current_music_name, $ext) = @_;

    opendir my $dir, $music_dir or die "Can't open dir: $!";
    my @list = grep /^[^\.]+\.$ext/, readdir $dir;
    closedir $dir;

    my $num = @list;
    my $index = int(rand($num));

    return $list[$index];
}

sub music_url {
    return $music_url;
}


### Controller

package main;
use Mojolicious::Lite;
use Mojo::ByteStream 'b';


# Set secret keyword
app->secret("musicserver");


# Load Text::Xslate
plugin charset => {charset => 'UTF-8'};
plugin 'xslate_renderer';
app->renderer->default_handler('tx');


get '/' => sub {
    shift->render( music_url => MusicServer::Model::music_url() );
} => 'index';


post '/next' => sub {
    my $self = shift;

    my $current_music_name = $self->param('current_music_name');
    my $ext = $self->param('ext') || 'mp3';
    my $next_music_name = MusicServer::Model::next_music_name($current_music_name, $ext);

    $self->render_json({
        nextMusicName => b($next_music_name)->decode('UTF-8'),
    });
} => 'next';


app->start;
