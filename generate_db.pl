#!/usr/bin/env perl
use strict;
use warnings;
use IO::Uncompress::Unzip qw(unzip $UnzipError);
use IO::Uncompress::Gunzip qw(gunzip $GunzipError);

my $num_args = scalar @ARGV;
if($num_args != 1) {
    print "\nUsage: generate_db.pl ngram_file_name\n";
    exit;
}

my $ngram_file_name = $ARGV[0];

my $class = "IO::Uncompress::Gunzip";
$class = "IO::Uncompress::Unzip" if($ngram_file_name =~ /\.zip$/);
my $uncompress = new $class $ngram_file_name
        or die "can't open $ngram_file_name";

my $previous_word;
my $previous_count = 0;
my %ngrams = ();
while(my $line = $uncompress->getline()) {
    print "$line";
    next unless($line  =~ /^([A-Za-z][a-z]+)\s+\d+\s+(\d+)\s/);
    my ($current_word, $current_count) = ($1, $2);
    if(($previous_word // '') eq $current_word) {
        $previous_count += $current_count;
        next;
    }

    $ngrams{$previous_word} = $previous_count;
    $previous_word = $current_word;
    $previous_count = 0;
}

$uncompress->close();

my @words = sort { $ngrams{$b} <=> $ngrams{$a} } keys %ngrams;

for my $word (@words) {
    print "$word\n";
}
