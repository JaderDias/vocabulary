package Vocabulary;
use strict;
use warnings;
use Dancer ':syntax';

our $VERSION = '0.1';

get '/' => sub {
    template 'index';
};

get '/download' => sub {
    template 'download';
};

get '/sort' => sub {
    set content_type => 'text/plain';
    return send_file 'dictionary.json';
};

get '/answer' => sub {
    set content_type => 'text/html';
    template 'answer';
};

true;
