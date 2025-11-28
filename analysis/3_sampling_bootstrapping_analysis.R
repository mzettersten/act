library(tidyverse)
library(ineq)
library(entropy)
library(here)


#read in subject choice data
read_path <- here::here("..","data","processed_data")
subject_choice <- read_csv(here(read_path,"act_subject_choice_processed.csv"))
subject_choice_long <- read_csv(here(read_path,"act_subject_choice_processed_long.csv"))
#read in exclusions info
exclusions <- read.csv(here::here(read_path,"all_exclusions.csv"))

#remove exclusions
subject_choice <- subject_choice %>%
  #add exclusions, but remove the duplicate p149 subject code with no trial data before integrating
  left_join(
    exclusions %>% filter(!(subject=="p149" & exclusion_reason=="technical error")) %>% select(-condition,-age_y)) %>%
  mutate(
    exclude_new=ifelse(is.na(exclude_new),"n",exclude_new),
    exclude_active_passive_comparison=ifelse(is.na(exclude_active_passive_comparison),"n",exclude_active_passive_comparison),
    late_data_collection=ifelse(is.na(late_data_collection),"n",late_data_collection)
  )

subject_choice <- subject_choice %>%
  mutate(experiment = case_when(
    version == "1" ~ "1",
    version == "2A" ~ "S1",
    TRUE ~ "2"
  ))

#set seed
set.seed(52887)

#create function to sample choices 1-4 with replacement
#start with a dataframe with four columns choice1_num, ..., choice4_num
#each row represents a particular subject's number of choices
#take a parameter total choice number and sample from choice 1 to choice 4 randomly with replacement for that total choice number
#update choice1_num, ..., choice4_num according to the number of time each of choice 1- choice 4 were selected
random_sampling_selection <- function(total_choice_num) {
  
  #sample choices with replacement
  sampled_choices <- sample(1:4, total_choice_num, replace=TRUE)
  #add to a dataframe of choices
  subject_choice_sampled <- data.frame(
    choice1_num = sum(sampled_choices==1),
    choice2_num = sum(sampled_choices==2),
    choice3_num = sum(sampled_choices==3),
    choice4_num = sum(sampled_choices==4)
  )
  
  return(subject_choice_sampled)
}

#create a function to create a randomly sampled distribution of subject choices
random_subject_choice <- function(subject_choice) {
  subject_choice_random <- subject_choice %>%
    ungroup() %>%
    select(experiment,version,subject,condition,stim_set,total_choices) %>%
    #use map to do a random sampling selection
    mutate(sampled_choices = map(total_choices, random_sampling_selection)) %>%
    #unnest the sampled choices
    unnest(cols = c(sampled_choices)) %>%
    ungroup() %>%
    rowwise() %>%
    mutate(
      gini = ineq::Gini(c(choice1_num,choice2_num,choice3_num,choice4_num),corr=TRUE),
      entropy = entropy::entropy(c(choice1_num,choice2_num,choice3_num,choice4_num))
    )
} 

compute_average_gini <- function(subject_choice_data) {
  subject_choice_by_subj <- subject_choice_data %>%
    group_by(subject) %>%
    summarize(mean_gini = mean(gini))
  
  mean(subject_choice_by_subj$mean_gini)
}

#### Experiment 1 ####

# number of bootstrapped samples
num_simulations <- 1000

#select subject choice for experiment 1
subject_choice_exp1 <- subject_choice %>%
  filter(experiment == "1" & condition == "active") %>%
  filter(exclude_new == "n" |exclude_active_passive_comparison == "n")

#create a nested dataframe to add to simulated data data frame
#specifically focused on the active condition in Exp 1
nested_subject_choice_exp1 <- subject_choice_exp1 %>%
  ungroup() %>%
  select(experiment,version,subject,condition,stim_set,total_choices) %>%
  nest()

#set up dataframe for simulation
simulated_data_exp1 <- tibble(
  simulation_num = seq(1,num_simulations),
  subject_choice_dataset = nested_subject_choice_exp1$data
) 

#simulate data using map
simulated_data_exp1 <- simulated_data_exp1 %>%
  mutate(
    subject_choice = map(subject_choice_dataset, random_subject_choice)
  ) %>%
  #compute average gini
  mutate(
    average_gini = map_dbl(subject_choice, compute_average_gini)
  )

#determine critical value from original data
subject_choice_exp1_by_subj <- subject_choice_exp1 %>%
  group_by(subject) %>%
  summarize(gini = mean(gini))
critical_value <- mean(subject_choice_exp1_by_subj$gini)
t.test(subject_choice_exp1_by_subj$gini)

#number of kids who sampled perfectly equally
sum(subject_choice_exp1_by_subj$gini == 0)
#percent
sum(subject_choice_exp1_by_subj$gini == 0)/length(subject_choice_exp1_by_subj$gini)

#extract p-value for a given gini value based on simulated null distribution
mean(simulated_data_exp1$average_gini <= critical_value)

#average simulated data
t.test(simulated_data_exp1$average_gini)

ggplot(simulated_data_exp1,aes(average_gini))+
  geom_histogram()+
  geom_vline(xintercept = critical_value, color = "red")

