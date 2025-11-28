#load packages
library(tidyverse)
library(janitor)
library(here)
library(ineq)
library(entropy)

#read in data
d <- read_csv(here("..","data","processed_data","act_allData_combined_anonymized.csv"))


#### selections ####
d$choice1 <- ifelse(d$trial_type=="learning"&(as.character(d$choice_image)==as.character(d$image1)),1,0)
d$choice2 <- ifelse(d$trial_type=="learning"&(as.character(d$choice_image)==as.character(d$image2)),1,0)
d$choice3 <- ifelse(d$trial_type=="learning"&(as.character(d$choice_image)==as.character(d$image3)),1,0)
d$choice4 <- ifelse(d$trial_type=="learning"&(as.character(d$choice_image)==as.character(d$image4)),1,0)

subject_choice <- d %>%
  filter(trial_type=="learning") %>%
  group_by(version,subject,condition,stim_set) %>%
  summarize(choice1_num=sum(choice1),
            choice2_num=sum(choice2),
            choice3_num=sum(choice3),
            choice4_num=sum(choice4)) %>%
  #total choices (for validation)
  mutate(
    total_choices = choice1_num+choice2_num+choice3_num+choice4_num
  )

#compute measures of (im)balance in choice frequency distribution
#compute gini coefficient and entropy for each subject choice distribution
subject_choice <- subject_choice %>%
  rowwise() %>%
  mutate(
    gini = ineq::Gini(c(choice1_num,choice2_num,choice3_num,choice4_num),corr=TRUE),
    entropy = entropy::entropy(c(choice1_num,choice2_num,choice3_num,choice4_num)),
    max_choice = max(choice1_num,choice2_num,choice3_num,choice4_num)
  )

d <- left_join(d,subject_choice)

## create a long subject choice file
subject_choice_long <- subject_choice %>%
  group_by(version,subject, condition,stim_set,total_choices,gini,entropy) %>%
  pivot_longer(
    c(choice1_num,choice2_num,choice3_num,choice4_num),
    names_to = "choice",
    values_to = "choice_num"
  )

subj_exposure <- d %>%
  filter(trial_type=="exposure") %>%
  group_by(version,subject,condition,stim_set) %>%
  summarize(exposure_number=exposure_num[1],
            image1_sorted = image1[trial_type=="exposure"][1],
            image2_sorted = image2[trial_type=="exposure"][1],
            image3_sorted = image3[trial_type=="exposure"][1],
            image4_sorted = image4[trial_type=="exposure"][1])

d <- left_join(d,subj_exposure)


d$high_label_exposure <- ifelse((d$trial_type=="exposure"|d$trial_type=="learning"|d$trial_type=="test")&d$exposure_number<7,as.character(d$image1_sorted),
                                ifelse((d$trial_type=="exposure"|d$trial_type=="learning"|d$trial_type=="test")&d$exposure_number<13,as.character(d$image2_sorted),
                                       ifelse((d$trial_type=="exposure"|d$trial_type=="learning"|d$trial_type=="test")&d$exposure_number<19,as.character(d$image3_sorted),
                                              ifelse((d$trial_type=="exposure"|d$trial_type=="learning"|d$trial_type=="test")&d$exposure_number<25,as.character(d$image4_sorted),NA))))

d$medium_label_exposure <- ifelse((d$trial_type=="exposure"|d$trial_type=="learning"|d$trial_type=="test")&d$exposure_number %in% c(7,8,13,14,19,20),as.character(d$image1_sorted),
                                  ifelse((d$trial_type=="exposure"|d$trial_type=="learning"|d$trial_type=="test")&d$exposure_number %in% c(1,2,15,16,21,22),as.character(d$image2_sorted),
                                         ifelse((d$trial_type=="exposure"|d$trial_type=="learning"|d$trial_type=="test")&d$exposure_number %in% c(3,4,9,10,23,24),as.character(d$image3_sorted),
                                                ifelse((d$trial_type=="exposure"|d$trial_type=="learning"|d$trial_type=="test")&d$exposure_number %in% c(5,6,11,12,17,18),as.character(d$image4_sorted),NA))))

d$low_label_exposure <- ifelse((d$trial_type=="exposure"|d$trial_type=="learning"|d$trial_type=="test")&d$exposure_number %in% c(10,11,15,17,21,23),as.character(d$image1_sorted),
                               ifelse((d$trial_type=="exposure"|d$trial_type=="learning"|d$trial_type=="test")&d$exposure_number %in% c(4,5,13,18,19,24),as.character(d$image2_sorted),
                                      ifelse((d$trial_type=="exposure"|d$trial_type=="learning"|d$trial_type=="test")&d$exposure_number %in% c(1,6,7,12,20,22),as.character(d$image3_sorted),
                                             ifelse((d$trial_type=="exposure"|d$trial_type=="learning"|d$trial_type=="test")&d$exposure_number %in% c(2,3,8,9,14,16),as.character(d$image4_sorted),NA))))

d$no_label_exposure <- ifelse((d$trial_type=="exposure"|d$trial_type=="learning"|d$trial_type=="test")&d$exposure_number %in% c(9,12,16,18,22,24),as.character(d$image1_sorted),
                              ifelse((d$trial_type=="exposure"|d$trial_type=="learning"|d$trial_type=="test")&d$exposure_number %in% c(3,6,14,17,20,23),as.character(d$image2_sorted),
                                     ifelse((d$trial_type=="exposure"|d$trial_type=="learning"|d$trial_type=="test")&d$exposure_number %in% c(2,5,8,11,19,21),as.character(d$image3_sorted),
                                            ifelse((d$trial_type=="exposure"|d$trial_type=="learning"|d$trial_type=="test")&d$exposure_number %in% c(1,4,7,10,13,15),as.character(d$image4_sorted),NA))))

d$image_option_type1 <- ifelse(d$available_image1==d$high_label_exposure,"high",
                               ifelse(d$available_image1==d$medium_label_exposure,"medium",
                                      ifelse(d$available_image1==d$low_label_exposure,"low",
                                             ifelse(d$available_image1==d$no_label_exposure,"no",NA))))

d$image_option_type2 <- ifelse(d$available_image2==d$high_label_exposure,"high",
                               ifelse(d$available_image2==d$medium_label_exposure,"medium",
                                      ifelse(d$available_image2==d$low_label_exposure,"low",
                                             ifelse(d$available_image2==d$no_label_exposure,"no",NA))))

d$choice_kind <- ifelse(d$choice_image==d$high_label_exposure,"high",
                        ifelse(d$choice_image==d$medium_label_exposure,"medium",
                               ifelse(d$choice_image==d$low_label_exposure,"low",
                                      ifelse(d$choice_image==d$no_label_exposure,"no",NA))))

d$target_kind <- ifelse(d$target_image==d$high_label_exposure,"high",
                        ifelse(d$target_image==d$medium_label_exposure,"medium",
                               ifelse(d$target_image==d$low_label_exposure,"low",
                                      ifelse(d$target_image==d$no_label_exposure,"no",NA))))

d$choice_trial_type <- NA
for (i in 1:length(d$subject)) {
  d$choice_trial_type[i] <- paste0(sort(c(as.character(d$image_option_type1[i]),as.character(d$image_option_type2[i]))),collapse="_")
}

d$lower_exposure_choice <- ifelse(d$choice_trial_type=="high_no",d$choice_kind=="no",
                                  ifelse(d$choice_trial_type=="high_medium",d$choice_kind=="medium",
                                         ifelse(d$choice_trial_type=="high_low",d$choice_kind=="low",
                                                ifelse(d$choice_trial_type=="medium_no",d$choice_kind=="no",
                                                       ifelse(d$choice_trial_type=="low_medium",d$choice_kind=="low",
                                                              ifelse(d$choice_trial_type=="low_no",d$choice_kind=="no",NA))))))

#informativeness difference
#just exposure
d$exp_more_frequent_choice <- ifelse(d$lower_exposure_choice,0,1)
d$image1_exp_freq <- ifelse(d$image_option_type1=="high",5,
                            ifelse(d$image_option_type1=="medium",2,
                                   ifelse(d$image_option_type1=="low",1,
                                          ifelse(d$image_option_type1=="no",0,NA))))
d$image2_exp_freq <- ifelse(d$image_option_type2=="high",5,
                            ifelse(d$image_option_type2=="medium",2,
                                   ifelse(d$image_option_type2=="low",1,
                                          ifelse(d$image_option_type2=="no",0,NA))))
d$image1_exp_log_rel_freq <- ifelse(d$image1_exp_freq==0,-log2(0.5/8),-log2(d$image1_exp_freq/8))
d$image2_exp_log_rel_freq <- ifelse(d$image2_exp_freq==0,-log2(0.5/8),-log2(d$image2_exp_freq/8))
d$exp_log_rel_freq_diff <- abs(d$image1_exp_log_rel_freq-d$image2_exp_log_rel_freq)
d$exp_log_rel_freq_diff_c <- d$exp_log_rel_freq_diff-mean(d$exp_log_rel_freq_diff,na.rm=T)
#don't need to worry about centering by version/ participant because this stays consistent within participant and version

#informativeness difference
#with choices
d$high_label_freq <- 5
d$medium_label_freq <- 2
d$low_label_freq <- 1
d$no_label_freq <- 0

d$object1_cur_freq <- ifelse((d$trial_num==3|d$trial_num==9)&d$trial_type_2=="activeWord-learning-2items"&d$image_option_type1=="high",5,
                             ifelse((d$trial_num==3|d$trial_num==9)&d$trial_type_2=="activeWord-learning-2items"&d$image_option_type1=="medium",2,
                                    ifelse((d$trial_num==3|d$trial_num==9)&d$trial_type_2=="activeWord-learning-2items"&d$image_option_type1=="low",1,
                                           ifelse((d$trial_num==3|d$trial_num==9)&d$trial_type_2=="activeWord-learning-2items"&d$image_option_type1=="no",0,NA))))
d$object2_cur_freq <- ifelse((d$trial_num==3|d$trial_num==9)&d$trial_type_2=="activeWord-learning-2items"&d$image_option_type2=="high",5,
                             ifelse((d$trial_num==3|d$trial_num==9)&d$trial_type_2=="activeWord-learning-2items"&d$image_option_type2=="medium",2,
                                    ifelse((d$trial_num==3|d$trial_num==9)&d$trial_type_2=="activeWord-learning-2items"&d$image_option_type2=="low",1,
                                           ifelse((d$trial_num==3|d$trial_num==9)&d$trial_type_2=="activeWord-learning-2items"&d$image_option_type2=="no",0,NA))))
d$high_cur_freq <- ifelse((d$trial_num==3|d$trial_num==9)&d$trial_type_2=="activeWord-learning-2items",5,NA)
d$medium_cur_freq <- ifelse((d$trial_num==3|d$trial_num==9)&d$trial_type_2=="activeWord-learning-2items",2,NA)
d$low_cur_freq <- ifelse((d$trial_num==3|d$trial_num==9)&d$trial_type_2=="activeWord-learning-2items",1,NA)
d$no_cur_freq <- ifelse((d$trial_num==3|d$trial_num==9)&d$trial_type_2=="activeWord-learning-2items",0,NA)

d$increment_high <- ifelse(d$trial_type_2=="activeWord-learning-2items"&d$choice_kind=="high",1,
                           ifelse(d$trial_type_2=="activeWord-learning-2items",0,NA))
d$increment_medium <- ifelse(d$trial_type_2=="activeWord-learning-2items"&d$choice_kind=="medium",1,
                             ifelse(d$trial_type_2=="activeWord-learning-2items",0,NA))
d$increment_low <- ifelse(d$trial_type_2=="activeWord-learning-2items"&d$choice_kind=="low",1,
                          ifelse(d$trial_type_2=="activeWord-learning-2items",0,NA))
d$increment_no <- ifelse(d$trial_type_2=="activeWord-learning-2items"&d$choice_kind=="no",1,
                         ifelse(d$trial_type_2=="activeWord-learning-2items",0,NA))

d <- d[order(d$subject,d$trial_index),]

d$add_high <- c(NA,d$increment_high[1:length(d$increment_high)-1])
d$add_medium <- c(NA,d$increment_medium[1:length(d$increment_medium)-1])
d$add_low <- c(NA,d$increment_low[1:length(d$increment_low)-1])
d$add_no <- c(NA,d$increment_no[1:length(d$increment_no)-1])

for (subj in unique(d$subject)) {
  for (tn in unique(d$trial_num[d$trial_type_2=="activeWord-learning-2items"])) {
    if ((tn>3 & tn<9)|(tn>9&tn<15)) {
      print(subj)
      print(tn)
      d$high_cur_freq[d$trial_num==tn& d$subject==subj&d$trial_type_2=="activeWord-learning-2items"] <- d$high_cur_freq[d$trial_num==tn-1 & d$subject==subj&!is.na(d$high_cur_freq)&d$trial_type_2=="activeWord-learning-2items"]+d$add_high[d$trial_num==tn & d$subject==subj&d$trial_type_2=="activeWord-learning-2items"]
      d$medium_cur_freq[d$trial_num==tn& d$subject==subj&d$trial_type_2=="activeWord-learning-2items"] <- d$medium_cur_freq[d$trial_num==tn-1 & d$subject==subj&!is.na(d$medium_cur_freq)&d$trial_type_2=="activeWord-learning-2items"]+d$add_medium[d$trial_num==tn & d$subject==subj&d$trial_type_2=="activeWord-learning-2items"]
      d$low_cur_freq[d$trial_num==tn& d$subject==subj&d$trial_type_2=="activeWord-learning-2items"] <- d$low_cur_freq[d$trial_num==tn-1 & d$subject==subj&!is.na(d$low_cur_freq)&d$trial_type_2=="activeWord-learning-2items"]+d$add_low[d$trial_num==tn & d$subject==subj&d$trial_type_2=="activeWord-learning-2items"]
      d$no_cur_freq[d$trial_num==tn& d$subject==subj&d$trial_type_2=="activeWord-learning-2items"] <- d$no_cur_freq[d$trial_num==tn-1 & d$subject==subj&!is.na(d$no_cur_freq)&d$trial_type_2=="activeWord-learning-2items"]+d$add_no[d$trial_num==tn & d$subject==subj&d$trial_type_2=="activeWord-learning-2items"]
    }
  }
}


d$image1_cur_exp_freq <- ifelse(d$image_option_type1=="high",d$high_cur_freq,
                                ifelse(d$image_option_type1=="medium",d$medium_cur_freq,
                                       ifelse(d$image_option_type1=="low",d$low_cur_freq,
                                              ifelse(d$image_option_type1=="no",d$no_cur_freq,NA))))
d$image2_cur_exp_freq <- ifelse(d$image_option_type2=="high",d$high_cur_freq,
                                ifelse(d$image_option_type2=="medium",d$medium_cur_freq,
                                       ifelse(d$image_option_type2=="low",d$low_cur_freq,
                                              ifelse(d$image_option_type2=="no",d$no_cur_freq,NA))))
d$cur_active_trial_num <- ifelse(d$trial_type_2=="activeWord-learning-2items"&d$stim_set==1,d$trial_num-2,
                                        ifelse(d$trial_type_2=="activeWord-learning-2items"&d$stim_set==2,d$trial_num-8,NA))
#familiar active trials encoded as 0 and -1
d$image1_cur_exp_log_rel_freq <- ifelse(d$image1_cur_exp_freq==0,-log2(0.5/(d$cur_active_trial_num+7)),-log2(d$image1_cur_exp_freq/(d$cur_active_trial_num+7)))
d$image2_cur_exp_log_rel_freq <- ifelse(d$image2_cur_exp_freq==0,-log2(0.5/(d$cur_active_trial_num+7)),-log2(d$image2_cur_exp_freq/(d$cur_active_trial_num+7)))
d$cur_exp_log_rel_freq_diff <- abs(d$image1_cur_exp_log_rel_freq-d$image2_cur_exp_log_rel_freq)
d$cur_exp_log_rel_freq_diff12 <- d$image1_cur_exp_log_rel_freq-d$image2_cur_exp_log_rel_freq
d$is_image1_choice <- ifelse(d$choice_image==d$available_image1,1,0)

#fix issue with target/foil assignment in familiar test trials:
d <- d %>%
  mutate(
    choice_type = case_when(
      test_audio == "stims/norm_where_penguin.wav"&choice_image=="stims/penguin.png"~"target",
      test_audio == "stims/norm_where_penguin.wav"&choice_image=="stims/cow.png"~"foil",
      TRUE ~ choice_type),
    is_right = case_when(
      test_audio == "stims/norm_where_penguin.wav"&choice_image=="stims/penguin.png"~1,
      test_audio == "stims/norm_where_penguin.wav"&choice_image=="stims/cow.png"~0,
      TRUE ~ is_right),
    target_image = case_when(
      test_audio == "stims/norm_where_penguin.wav"~ "stims/penguin.png",
      TRUE ~ target_image),
    foil_image = case_when(
      test_audio == "stims/norm_where_penguin.wav"~ "stims/cow.png",
      TRUE ~ foil_image),
    target_location = case_when(
      test_audio == "stims/norm_where_penguin.wav"~ "right",
      TRUE ~ target_location),
    foil_location = case_when(
      test_audio == "stims/norm_where_penguin.wav"~ "left",
      TRUE ~ foil_location),
  )



#write data to file
write_csv(d, here("..","data","processed_data","act_allData_processed.csv"))
write_csv(subject_choice, here("..","data","processed_data","act_subject_choice_processed.csv"))
write_csv(subject_choice_long, here("..","data","processed_data","act_subject_choice_processed_long.csv"))
