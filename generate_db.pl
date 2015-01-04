#!/usr/bin/env perl
use strict;
use warnings;
use IO::Uncompress::Unzip qw(unzip $UnzipError);

my $num_args = scalar @ARGV;
if($num_args != 1) {
    print "\nUsage: generate_db.pl ngram_file_name\n";
    exit;
}

my $ngram_file_name = $ARGV[0];

my $z = new IO::Uncompress::Unzip $ngram_file_name
    or die "unzip failed: $UnzipError\n";

my $previous_word;
my $previous_count = 0;
while(my $line = $z->getline()) {
    next unless($line  =~ /^([A-Za-z][a-z]+)\s+\d+\s+(\d+)\s/);
    my ($current_word, $current_count) = ($1, $2);
    if(($previous_word // '') eq $current_word) {
        $previous_count += $current_count;
        next;
    }

    print "$previous_word\t$previous_count\n";
    $previous_word = $current_word;
    $previous_count = 0;
}

$z->close();

