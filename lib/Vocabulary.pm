package Vocabulary;
use strict;
use warnings;
use Dancer ':syntax';
use IO::Uncompress::Unzip qw(unzip $UnzipError);
use IO::Uncompress::Gunzip qw(gunzip $GunzipError);

our $VERSION = '0.1';

get '/' => sub {
    template 'index';
};

get '/download' => sub {
    template 'download';
};

get '/sort' => sub {
        my $ngram_file_name = '../tail_ngram.gz';
        my $class = "IO::Uncompress::Gunzip";
        $class = "IO::Uncompress::Unzip" if($ngram_file_name =~ /\.zip$/);
        my $uncompress = new $class $ngram_file_name
                or die "can't open $ngram_file_name";

        my $previous_word;
        my $previous_count = 0;
        my %ngrams = ();
        while(my $line = $uncompress->getline()) {
            next unless($line  =~ /^([A-Za-z][a-z]+)\s+\d+\s+(\d+)\s/);
            my ($current_word, $current_count) = ($1, $2);
            if(($previous_word // '') eq $current_word) {
                $previous_count += $current_count;
                next;
            }

            $ngrams{$previous_word} = $previous_count if $previous_word;
            $previous_word = $current_word;
            $previous_count = 0;
        }

        $uncompress->close();

        my @words = sort { $ngrams{$b} <=> $ngrams{$a} } keys %ngrams;
        return to_json \@words;
};

get '/answer' => sub {
        template 'answer';
};

true;
